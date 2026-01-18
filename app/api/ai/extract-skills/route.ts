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
    const { text } = await request.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'テキストが必要です' }, { status: 400 })
    }

    // Get existing skills from database for reference
    type SkillsResult = { data: { name: string; category: string }[] | null }
    const skillsResult = await supabase
      .from('skills')
      .select('name, category')
      .limit(200) as unknown as SkillsResult

    const skillsList = skillsResult.data?.map(s => s.name).join(', ') || ''

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
与えられたテキスト（職務経歴書、自己紹介文など）から、技術スキルを抽出してください。

既存のスキルリスト: ${skillsList}

以下のカテゴリに分類してください:
- language: プログラミング言語 (Python, JavaScript, Go, Rust等)
- framework: フレームワーク (React, Django, FastAPI, LangChain等)
- ml: 機械学習 (TensorFlow, PyTorch, scikit-learn等)
- genai: 生成AI (GPT, Claude, Stable Diffusion, RAG等)
- cloud: クラウド (AWS, GCP, Azure等)
- database: データベース (PostgreSQL, MongoDB, Redis等)
- devops: DevOps (Docker, Kubernetes, CI/CD等)
- other: その他

JSON形式で回答してください:
{
  "skills": [
    {"name": "スキル名", "category": "カテゴリ", "confidence": 0.0-1.0}
  ]
}

注意:
- スキル名は正式名称で（略称は避ける）
- 信頼度（confidence）は文脈から判断した確信度
- 重複は除外
- 最大20件まで`
          },
          {
            role: 'user',
            content: text.slice(0, 5000) // Limit input length
          }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('OpenAI API error:', error)
      return NextResponse.json({ error: 'スキル抽出に失敗しました' }, { status: 500 })
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: 'スキル抽出に失敗しました' }, { status: 500 })
    }

    const parsed = JSON.parse(content)
    const skills: ExtractedSkill[] = parsed.skills || []

    // Sort by confidence
    skills.sort((a, b) => b.confidence - a.confidence)

    return NextResponse.json({ skills })
  } catch (error) {
    console.error('Skill extraction error:', error)
    return NextResponse.json({ error: 'サーバーエラー' }, { status: 500 })
  }
}
