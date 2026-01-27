/**
 * CareerBridge かんたんLINE応募フォーム
 * Google Apps Script
 *
 * 使い方:
 * 1. スプレッドシート（https://docs.google.com/spreadsheets/d/1RnW0OmIUm49OkmgBx23Jx6X5o77lQ7wieXSfoZ4A1Uk/edit）を開く
 * 2. 拡張機能 → Apps Script をクリック
 * 3. このコードを Code.gs にコピー
 * 4. デプロイ → 新しいデプロイ → ウェブアプリ
 *    - 次のユーザーとして実行: 自分
 *    - アクセスできるユーザー: 全員
 * 5. デプロイ後のURLを .env.local の NEXT_PUBLIC_GAS_API_URL に設定
 */

// スプレッドシートID（URLから取得）
const SPREADSHEET_ID = '1RnW0OmIUm49OkmgBx23Jx6X5o77lQ7wieXSfoZ4A1Uk';
const SHEET_NAME = 'Sheet1'; // シート名（必要に応じて変更）

/**
 * POSTリクエスト処理（Next.jsフォームからの送信）
 */
function doPost(e) {
  try {
    // リクエストボディからJSONを取得
    const data = JSON.parse(e.postData.contents);

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);

    if (!sheet) {
      return createResponse({ success: false, message: 'シートが見つかりません' });
    }

    // データを配列に変換（カラム順序に合わせる）
    const rowData = [
      data.name || '',                              // 氏名
      data.age || '',                               // 年齢
      data.gender || '',                            // 性別
      data.prefecture || '',                        // 都道府県
      data.canRelocate ? '可' : '不可',             // 転居可否
      data.hasResume ? 'あり' : 'なし',             // 履歴書有無
      data.jobTemperature || '',                    // 転職温度（複数選択をカンマ区切り）
      new Date(),                                   // 送信日時
      data.lineId || ''                             // LINE ID（任意）
    ];

    // 最終行に追加
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
 * 初期セットアップ: ヘッダー行を追加
 * 最初に一度だけ実行してください
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

  // 1行目にヘッダーを設定
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // ヘッダー行を太字に
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');

  // 列幅を自動調整
  for (let i = 1; i <= headers.length; i++) {
    sheet.autoResizeColumn(i);
  }

  console.log('Headers setup complete!');
}

/**
 * テスト用: フォームデータを手動で追加
 */
function testAddRow() {
  const testData = {
    name: 'テスト太郎',
    age: '25',
    gender: '男性',
    prefecture: '東京都',
    canRelocate: true,
    hasResume: false,
    jobTemperature: 'すぐに転職したい',
    lineId: '@test123'
  };

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);

  const rowData = [
    testData.name,
    testData.age,
    testData.gender,
    testData.prefecture,
    testData.canRelocate ? '可' : '不可',
    testData.hasResume ? 'あり' : 'なし',
    testData.jobTemperature,
    new Date(),
    testData.lineId
  ];

  sheet.appendRow(rowData);
  console.log('Test row added!');
}
