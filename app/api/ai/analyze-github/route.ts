import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

interface ExtractedSkill {
  name: string
  category: string
  confidence: number
}

export async function POST(request: Request) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  if (!OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI APIが設定されていません' }, { status: 500 })
  }

  try {
    const { githubUrl } = await request.json()

    if (!githubUrl || typeof githubUrl !== 'string') {
      return NextResponse.json({ error: 'GitHub URLが必要です' }, { status: 400 })
    }

    // Extract username from URL
    const match = githubUrl.match(/github\.com\/([^\/]+)/i)
    if (!match) {
      return NextResponse.json({ error: '有効なGitHub URLを入力してください' }, { status: 400 })
    }
    const username = match[1]

    // Fetch user's repositories from GitHub API
    const reposResponse = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=30`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'CareerBridge',
        },
      }
    )

    if (!reposResponse.ok) {
      return NextResponse.json({ error: 'GitHubユーザーが見つかりません' }, { status: 404 })
    }

    const repos = await reposResponse.json()

    // Extract languages and topics
    const languages = new Map<string, number>()
    const topics: string[] = []

    for (const repo of repos) {
      if (repo.language) {
        languages.set(repo.language, (languages.get(repo.language) || 0) + 1)
      }
      if (repo.topics) {
        topics.push(...repo.topics)
      }
    }

    // Build analysis text
    const analysisText = `
GitHub Profile Analysis for: ${username}

Repositories: ${repos.length}

Programming Languages (by repository count):
${Array.from(languages.entries())
  .sort((a, b) => b[1] - a[1])
  .map(([lang, count]) => `- ${lang}: ${count} repos`)
  .join('\n')}

Topics/Tags found:
${Array.from(new Set(topics)).join(', ')}

Repository Descriptions:
${repos
  .filter((r: { description: string }) => r.description)
  .slice(0, 10)
  .map((r: { name: string; description: string }) => `- ${r.name}: ${r.description}`)
  .join('\n')}
`

    // Get existing skills from database
    type SkillsResult = { data: { name: string; category: string }[] | null }
    const skillsResult = await supabase
      .from('skills')
      .select('name, category')
      .limit(200) as unknown as SkillsResult

    const skillsList = skillsResult.data?.map(s => s.name).join(', ') || ''

    // Use OpenAI to analyze
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `あなたはAIエンジニア向け求人マッチングサービスのスキル抽出アシスタントです。
GitHubプロフィールの分析結果から、技術スキルを抽出してください。

既存のスキルリスト: ${skillsList}

以下のカテゴリに分類してください:
- language: プログラミング言語
- framework: フレームワーク
- ml: 機械学習
- genai: 生成AI
- cloud: クラウド
- database: データベース
- devops: DevOps
- other: その他

JSON形式で回答:
{
  "skills": [
    {"name": "スキル名", "category": "カテゴリ", "confidence": 0.0-1.0}
  ],
  "summary": "このエンジニアの強み・特徴の簡潔な説明（日本語、100文字以内）"
}

注意:
- リポジトリ数が多い言語は高い信頼度
- topicsから推測されるスキルは中程度の信頼度
- 最大20件まで`
          },
          {
            role: 'user',
            content: analysisText
          }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('OpenAI API error:', error)
      return NextResponse.json({ error: 'スキル分析に失敗しました' }, { status: 500 })
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: 'スキル分析に失敗しました' }, { status: 500 })
    }

    const parsed = JSON.parse(content)
    const skills: ExtractedSkill[] = parsed.skills || []
    const summary: string = parsed.summary || ''

    // Sort by confidence
    skills.sort((a, b) => b.confidence - a.confidence)

    return NextResponse.json({
      skills,
      summary,
      repoCount: repos.length,
      topLanguages: Array.from(languages.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count })),
    })
  } catch (error) {
    console.error('GitHub analysis error:', error)
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 })
  }
}
