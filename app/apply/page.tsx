'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, ShieldCheck, CheckCircle, ArrowLeft, Send, ChevronDown, FileText, MessageCircle } from 'lucide-react'

const PREFECTURES = [
  '北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県',
  '茨城県', '栃木県', '群馬県', '埼玉県', '千葉県', '東京都', '神奈川県',
  '新潟県', '富山県', '石川県', '福井県', '山梨県', '長野県',
  '岐阜県', '静岡県', '愛知県', '三重県',
  '滋賀県', '京都府', '大阪府', '兵庫県', '奈良県', '和歌山県',
  '鳥取県', '島根県', '岡山県', '広島県', '山口県',
  '徳島県', '香川県', '愛媛県', '高知県',
  '福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'
]

const JOB_TEMPERATURES = [
  { value: 'すぐに転職したい', label: 'すぐに転職したい' },
  { value: '良い求人があれば', label: '良い求人があれば' },
  { value: '情報収集中', label: '情報収集中' },
]

// GASのWebアプリURL（デプロイ後に設定）
const GAS_API_URL = process.env.NEXT_PUBLIC_GAS_API_URL || ''

// LINE友達追加URL
const LINE_ADD_URL = 'https://lin.ee/u55ERBk'

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    prefecture: '',
    canRelocate: false,
    hasResume: false,
    jobTemperature: [] as string[],
    lineId: '',
    agreedToTerms: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [isTermsOpen, setIsTermsOpen] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleTemperatureChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      jobTemperature: prev.jobTemperature.includes(value)
        ? prev.jobTemperature.filter(v => v !== value)
        : [...prev.jobTemperature, value]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // GAS APIが設定されている場合は送信（GETパラメータ方式）
      if (GAS_API_URL) {
        const params = new URLSearchParams({
          name: formData.name,
          age: formData.age,
          gender: formData.gender,
          prefecture: formData.prefecture,
          canRelocate: String(formData.canRelocate),
          hasResume: String(formData.hasResume),
          jobTemperature: formData.jobTemperature.join(', '),
          lineId: formData.lineId,
        })

        // GETリクエストで送信（CORS回避）
        await fetch(`${GAS_API_URL}?${params.toString()}`, {
          method: 'GET',
          mode: 'no-cors',
        })
        // no-corsモードではレスポンスを読めないので、成功とみなす
      }

      // デモ用：常に成功
      setIsSuccess(true)
    } catch (err) {
      console.error('Submit error:', err)
      setError('送信中にエラーが発生しました。もう一度お試しください。')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-lg">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-green-600 mb-4">応募完了!</h1>
          <p className="text-slate-600 mb-6">
            ご応募ありがとうございます。<br />
            <span className="font-medium">LINEを追加して、担当者からの連絡をお待ちください。</span>
          </p>

          {/* LINE友達追加ボタン */}
          <a
            href={LINE_ADD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 bg-[#06C755] hover:bg-[#05b34c] text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 mb-4"
          >
            <MessageCircle className="w-6 h-6" />
            LINEで友達追加する
          </a>

          <p className="text-xs text-slate-500 mb-6">
            ※LINEを追加いただくと、担当者からスムーズにご連絡できます
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            トップページに戻る
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <span className="text-2xl font-bold text-green-600">CareerBridge</span>
          </Link>
          <h1 className="text-xl font-bold text-slate-800 mb-2">かんたんLINE応募</h1>
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 px-4 py-2 rounded-full text-sm">
            <Clock className="w-4 h-4" />
            最短10秒
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本情報 */}
            <div className="border-b border-slate-200 pb-2 mb-4">
              <span className="text-sm text-slate-500">基本情報</span>
            </div>

            {/* 氏名 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                氏名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="山田 太郎"
                required
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
              />
            </div>

            {/* 年齢 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                年齢 <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="28"
                min="18"
                max="99"
                required
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
              />
            </div>

            {/* 性別 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                性別 <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                }}
              >
                <option value="">選択してください</option>
                <option value="男性">男性</option>
                <option value="女性">女性</option>
                <option value="その他">その他</option>
                <option value="回答しない">回答しない</option>
              </select>
            </div>

            {/* 都道府県 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                都道府県 <span className="text-red-500">*</span>
              </label>
              <select
                name="prefecture"
                value={formData.prefecture}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors appearance-none cursor-pointer"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                }}
              >
                <option value="">選択してください</option>
                {PREFECTURES.map(pref => (
                  <option key={pref} value={pref}>{pref}</option>
                ))}
              </select>
            </div>

            {/* その他の情報 */}
            <div className="border-b border-slate-200 pb-2 mb-4 pt-4">
              <span className="text-sm text-slate-500">その他の情報</span>
            </div>

            {/* 転居可否 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">転居可否</label>
              <label className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all ${formData.canRelocate ? 'bg-green-50 border border-green-300' : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'}`}>
                <input
                  type="checkbox"
                  name="canRelocate"
                  checked={formData.canRelocate}
                  onChange={handleChange}
                  className="w-5 h-5 accent-green-500 cursor-pointer"
                />
                <span className="text-slate-700">転居可能</span>
              </label>
            </div>

            {/* 履歴書有無 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">履歴書有無</label>
              <label className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all ${formData.hasResume ? 'bg-green-50 border border-green-300' : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'}`}>
                <input
                  type="checkbox"
                  name="hasResume"
                  checked={formData.hasResume}
                  onChange={handleChange}
                  className="w-5 h-5 accent-green-500 cursor-pointer"
                />
                <span className="text-slate-700">履歴書あり</span>
              </label>
            </div>

            {/* 転職温度 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">転職温度（複数選択可）</label>
              <div className="space-y-2">
                {JOB_TEMPERATURES.map(temp => (
                  <label
                    key={temp.value}
                    className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all ${formData.jobTemperature.includes(temp.value) ? 'bg-green-50 border border-green-300' : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'}`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.jobTemperature.includes(temp.value)}
                      onChange={() => handleTemperatureChange(temp.value)}
                      className="w-5 h-5 accent-green-500 cursor-pointer"
                    />
                    <span className="text-slate-700">{temp.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* LINE ID */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                LINE ID（任意）
              </label>
              <input
                type="text"
                name="lineId"
                value={formData.lineId}
                onChange={handleChange}
                placeholder="@example"
                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors"
              />
            </div>

            {/* 同意確認セクション */}
            <div className="pt-4">
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                {/* トグルヘッダー */}
                <button
                  type="button"
                  onClick={() => setIsTermsOpen(!isTermsOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                >
                  <span className="flex items-center gap-2 text-sm text-slate-600">
                    <FileText className="w-4 h-4 text-slate-400" />
                    求人情報のご案内について
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isTermsOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* 折りたたみコンテンツ */}
                <div className={`overflow-hidden transition-all duration-300 ${isTermsOpen ? 'max-h-96' : 'max-h-0'}`}>
                  <div className="px-4 py-3 bg-slate-50/50 text-xs text-slate-500 leading-relaxed space-y-2">
                    <p>
                      株式会社エヌアンドエスでは、提携先の<span className="text-slate-700 font-medium">Youtopia株式会社</span>様の求人情報をご案内しています。
                    </p>
                    <p className="text-slate-400">以下の内容にご同意のうえ、ご応募ください：</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-400">
                      <li>お名前、連絡先、希望職種等の情報をYoutopia株式会社様に提供すること</li>
                      <li>Youtopia株式会社様が職業紹介の目的でこれらの情報を同意の元利用すること</li>
                      <li>Youtopia株式会社様から直接ご連絡が届く場合があること</li>
                    </ul>
                    <p className="text-slate-400 pt-1">
                      ※当社は情報提供のみを行い、採用プロセスや条件等はYoutopia株式会社様が行います。<br />
                      ※ご同意いただいた後でも、いつでも同意を撤回できます。
                    </p>
                  </div>
                </div>

                {/* 同意チェックボックス */}
                <label className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all border-t border-slate-200 ${formData.agreedToTerms ? 'bg-green-50' : 'bg-white hover:bg-slate-50'}`}>
                  <input
                    type="checkbox"
                    name="agreedToTerms"
                    checked={formData.agreedToTerms}
                    onChange={handleChange}
                    required
                    className="w-4 h-4 accent-green-500 cursor-pointer"
                  />
                  <span className="text-sm text-slate-600">
                    上記内容に同意します <span className="text-red-500">*</span>
                  </span>
                </label>
              </div>
              <p className="text-xs text-slate-400 mt-2 text-center">
                <Link href="/terms" className="text-green-600 hover:underline">利用規約</Link>
                {' '}および{' '}
                <Link href="/privacy" className="text-green-600 hover:underline">プライバシーポリシー</Link>
                {' '}に同意の上、ご応募ください。
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !formData.agreedToTerms}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg shadow-lg hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  送信中...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  応募する
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-center gap-4 mt-6 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-green-500" />
              最短10秒
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              安全な通信
            </span>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-slate-500 hover:text-slate-700 transition-colors text-sm">
            トップページに戻る
          </Link>
        </div>
      </div>
    </div>
  )
}
