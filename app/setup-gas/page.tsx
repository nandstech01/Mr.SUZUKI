'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Copy, Check, ExternalLink } from 'lucide-react'

const GAS_CODE = `/**
 * CareerBridge かんたんLINE応募フォーム
 * Google Apps Script
 */

// スプレッドシートID（URLから取得）
const SPREADSHEET_ID = '1RnW0OmIUm49OkmgBx23Jx6X5o77lQ7wieXSfoZ4A1Uk';
const SHEET_NAME = 'Sheet1';

/**
 * POSTリクエスト処理（Next.jsフォームからの送信）
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      return createResponse({ success: false, message: 'シートが見つかりません' });
    }

    const rowData = [
      data.name || '',
      data.age || '',
      data.gender || '',
      data.prefecture || '',
      data.canRelocate ? '可' : '不可',
      data.hasResume ? 'あり' : 'なし',
      data.jobTemperature || '',
      new Date(),
      data.lineId || ''
    ];

    sheet.appendRow(rowData);

    return createResponse({ success: true, message: '応募が完了しました' });

  } catch (error) {
    console.error('Error:', error);
    return createResponse({ success: false, message: 'エラーが発生しました: ' + error.message });
  }
}

/**
 * GETリクエスト処理（動作確認用）
 */
function doGet() {
  return createResponse({
    success: true,
    message: 'CareerBridge API is running',
    timestamp: new Date().toISOString()
  });
}

/**
 * JSONレスポンスを作成
 */
function createResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 初期セットアップ: ヘッダー行を追加（最初に1回だけ実行）
 */
function setupHeaders() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);

  const headers = [
    '氏名',
    '年齢',
    '性別',
    '都道府県',
    '転居可否',
    '履歴書有無',
    '転職温度',
    '送信日時',
    'LINE ID'
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');

  for (let i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }

  console.log('Headers setup complete!');
}`

export default function SetupGasPage() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(GAS_CODE)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors text-sm mb-4">
            <ArrowLeft className="w-4 h-4" />
            トップページに戻る
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">GAS セットアップガイド</h1>
          <p className="text-slate-600 mt-2">フォームデータをスプレッドシートに保存するための設定</p>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {/* Step 1 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
              スプレッドシートを開く
            </h2>
            <a
              href="https://docs.google.com/spreadsheets/d/1RnW0OmIUm49OkmgBx23Jx6X5o77lQ7wieXSfoZ4A1Uk/edit"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
            >
              スプレッドシートを開く
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
              Apps Script を開く
            </h2>
            <p className="text-slate-600">
              メニューから <code className="bg-slate-100 px-2 py-1 rounded text-sm">拡張機能</code> → <code className="bg-slate-100 px-2 py-1 rounded text-sm">Apps Script</code> をクリック
            </p>
          </div>

          {/* Step 3 - Code */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
              コードをコピー
            </h2>
            <p className="text-slate-600 mb-4">
              以下のコードを <code className="bg-slate-100 px-2 py-1 rounded text-sm">コード.gs</code> に貼り付け
            </p>

            {/* Code Block with Copy Button */}
            <div className="relative">
              <button
                onClick={handleCopy}
                className={`absolute top-3 right-3 px-3 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${
                  copied
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    コピー完了!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    コピー
                  </>
                )}
              </button>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed max-h-96 overflow-y-auto">
                <code>{GAS_CODE}</code>
              </pre>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
              初期設定を実行
            </h2>
            <ol className="list-decimal list-inside text-slate-600 space-y-2">
              <li>関数の選択で <code className="bg-slate-100 px-2 py-1 rounded text-sm">setupHeaders</code> を選択</li>
              <li><code className="bg-slate-100 px-2 py-1 rounded text-sm">実行</code> ボタンをクリック</li>
              <li>権限を許可（初回のみ）</li>
            </ol>
          </div>

          {/* Step 5 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
              デプロイ
            </h2>
            <ol className="list-decimal list-inside text-slate-600 space-y-2">
              <li><code className="bg-slate-100 px-2 py-1 rounded text-sm">デプロイ</code> → <code className="bg-slate-100 px-2 py-1 rounded text-sm">新しいデプロイ</code></li>
              <li>歯車アイコン → <code className="bg-slate-100 px-2 py-1 rounded text-sm">ウェブアプリ</code></li>
              <li>設定:
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>次のユーザーとして実行: <strong>自分</strong></li>
                  <li>アクセスできるユーザー: <strong>全員</strong></li>
                </ul>
              </li>
              <li><code className="bg-slate-100 px-2 py-1 rounded text-sm">デプロイ</code> をクリック</li>
              <li><strong>URLをコピー</strong></li>
            </ol>
          </div>

          {/* Step 6 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">6</span>
              環境変数を設定
            </h2>
            <p className="text-slate-600 mb-3">
              プロジェクトの <code className="bg-slate-100 px-2 py-1 rounded text-sm">.env.local</code> に追加:
            </p>
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm">
              <code>NEXT_PUBLIC_GAS_API_URL=https://script.google.com/macros/s/XXXXX/exec</code>
            </pre>
          </div>

          {/* Done */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-green-800 mb-2">完了!</h2>
            <p className="text-green-700">
              フォームから送信されたデータがスプレッドシートに保存されるようになります。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
