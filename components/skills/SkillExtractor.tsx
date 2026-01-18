'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sparkles, Github, FileText, Loader2 } from 'lucide-react'

interface ExtractedSkill {
  name: string
  category: string
  confidence: number
}

interface SkillExtractorProps {
  onSkillsSelected: (skills: ExtractedSkill[]) => void
}

export function SkillExtractor({ onSkillsSelected }: SkillExtractorProps) {
  const [text, setText] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [extractedSkills, setExtractedSkills] = useState<ExtractedSkill[]>([])
  const [selectedSkills, setSelectedSkills] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [summary, setSummary] = useState('')

  const handleExtractFromText = async () => {
    if (!text.trim()) return

    setLoading(true)
    setError('')
    setExtractedSkills([])
    setSummary('')

    try {
      const res = await fetch('/api/ai/extract-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'スキル抽出に失敗しました')
      }

      setExtractedSkills(data.skills)
      // Auto-select high confidence skills
      const autoSelected = new Set<string>(
        data.skills.filter((s: ExtractedSkill) => s.confidence >= 0.7).map((s: ExtractedSkill) => s.name)
      )
      setSelectedSkills(autoSelected)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyzeGithub = async () => {
    if (!githubUrl.trim()) return

    setLoading(true)
    setError('')
    setExtractedSkills([])
    setSummary('')

    try {
      const res = await fetch('/api/ai/analyze-github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ githubUrl }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'GitHub分析に失敗しました')
      }

      setExtractedSkills(data.skills)
      setSummary(data.summary || '')
      // Auto-select high confidence skills
      const autoSelected = new Set<string>(
        data.skills.filter((s: ExtractedSkill) => s.confidence >= 0.7).map((s: ExtractedSkill) => s.name)
      )
      setSelectedSkills(autoSelected)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  const toggleSkill = (skillName: string) => {
    const newSelected = new Set(selectedSkills)
    if (newSelected.has(skillName)) {
      newSelected.delete(skillName)
    } else {
      newSelected.add(skillName)
    }
    setSelectedSkills(newSelected)
  }

  const handleConfirm = () => {
    const selected = extractedSkills.filter(s => selectedSkills.has(s.name))
    onSkillsSelected(selected)
  }

  const categoryLabels: Record<string, string> = {
    language: '言語',
    framework: 'FW',
    ml: 'ML',
    genai: 'AI',
    cloud: 'Cloud',
    database: 'DB',
    devops: 'DevOps',
    other: '他',
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-100 border-green-300'
    if (confidence >= 0.6) return 'bg-blue-100 border-blue-300'
    return 'bg-slate-100 border-slate-300'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          AIスキル自動抽出
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="text">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">
              <FileText className="w-4 h-4 mr-2" />
              テキストから
            </TabsTrigger>
            <TabsTrigger value="github">
              <Github className="w-4 h-4 mr-2" />
              GitHubから
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <div>
              <Label htmlFor="text">職務経歴書・自己紹介文</Label>
              <Textarea
                id="text"
                placeholder="職務経歴書や自己紹介文をペーストしてください..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={6}
              />
            </div>
            <Button onClick={handleExtractFromText} disabled={loading || !text.trim()}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  抽出中...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  スキルを抽出
                </>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="github" className="space-y-4">
            <div>
              <Label htmlFor="github">GitHub URL</Label>
              <Input
                id="github"
                placeholder="https://github.com/username"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
              />
            </div>
            <Button onClick={handleAnalyzeGithub} disabled={loading || !githubUrl.trim()}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  分析中...
                </>
              ) : (
                <>
                  <Github className="w-4 h-4 mr-2" />
                  GitHubを分析
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>

        {error && (
          <div className="mt-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        {summary && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">{summary}</p>
          </div>
        )}

        {extractedSkills.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label>抽出されたスキル（{extractedSkills.length}件）</Label>
              <span className="text-xs text-muted-foreground">
                チェックを入れて追加するスキルを選択
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {extractedSkills.map((skill) => (
                <div
                  key={skill.name}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer ${
                    getConfidenceColor(skill.confidence)
                  } ${selectedSkills.has(skill.name) ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => toggleSkill(skill.name)}
                >
                  <Checkbox
                    checked={selectedSkills.has(skill.name)}
                    onCheckedChange={() => toggleSkill(skill.name)}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{skill.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {categoryLabels[skill.category] || skill.category} ・
                      信頼度 {Math.round(skill.confidence * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button
              onClick={handleConfirm}
              disabled={selectedSkills.size === 0}
              className="w-full"
            >
              選択したスキル（{selectedSkills.size}件）を追加
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
