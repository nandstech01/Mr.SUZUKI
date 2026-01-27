import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.EMAIL_FROM || 'ai-engineer@nands.tech'
const APP_NAME = 'CareerBridge'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

interface SendEmailParams {
  to: string
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.log('[Email] RESEND_API_KEY not set, skipping email:', { to, subject })
    return { success: false, error: 'RESEND_API_KEY not configured' }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: `${APP_NAME} <${FROM_EMAIL}>`,
      to,
      subject,
      html,
      text,
    })

    if (error) {
      console.error('[Email] Failed to send:', error)
      return { success: false, error }
    }

    console.log('[Email] Sent successfully:', data?.id)
    return { success: true, data }
  } catch (error) {
    console.error('[Email] Error:', error)
    return { success: false, error }
  }
}

// Email templates
export async function sendWelcomeEmail(email: string, displayName: string, role: 'engineer' | 'company') {
  const dashboardUrl = role === 'engineer' ? `${BASE_URL}/engineer/dashboard` : `${BASE_URL}/company/dashboard`

  return sendEmail({
    to: email,
    subject: `${APP_NAME}へようこそ！`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f8fafc; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${APP_NAME}</h1>
          </div>
          <div class="content">
            <h2>${displayName}さん、ようこそ！</h2>
            <p>
              ${APP_NAME}への登録ありがとうございます。
              ${role === 'engineer'
                ? 'AIエンジニアとして、あなたのスキルに合った最適な案件を見つけましょう。'
                : '御社に最適なAIエンジニアを見つけましょう。'}
            </p>
            <p>まずはプロフィールを設定して、${role === 'engineer' ? '案件への応募' : 'エンジニアの採用'}を始めましょう。</p>
            <a href="${dashboardUrl}" class="button">ダッシュボードへ</a>
          </div>
          <div class="footer">
            <p>このメールは${APP_NAME}から自動送信されています。</p>
          </div>
        </div>
      </body>
      </html>
    `,
  })
}

export async function sendApplicationReceivedEmail(
  engineerEmail: string,
  engineerName: string,
  jobTitle: string,
  companyName: string
) {
  return sendEmail({
    to: engineerEmail,
    subject: `【${APP_NAME}】応募を受け付けました`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f8fafc; }
          .job-card { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${APP_NAME}</h1>
          </div>
          <div class="content">
            <h2>${engineerName}さん</h2>
            <p>以下の案件への応募を受け付けました。</p>
            <div class="job-card">
              <strong>${jobTitle}</strong><br>
              <span style="color: #666;">${companyName}</span>
            </div>
            <p>企業からの連絡をお待ちください。応募状況はダッシュボードで確認できます。</p>
            <a href="${BASE_URL}/engineer/applications" class="button">応募状況を確認</a>
          </div>
          <div class="footer">
            <p>このメールは${APP_NAME}から自動送信されています。</p>
          </div>
        </div>
      </body>
      </html>
    `,
  })
}

export async function sendNewApplicationEmail(
  companyEmail: string,
  companyName: string,
  engineerName: string,
  jobTitle: string
) {
  return sendEmail({
    to: companyEmail,
    subject: `【${APP_NAME}】新しい応募がありました`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f8fafc; }
          .highlight { background: #dbeafe; border-radius: 8px; padding: 16px; margin: 16px 0; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${APP_NAME}</h1>
          </div>
          <div class="content">
            <h2>${companyName}様</h2>
            <p>「${jobTitle}」に新しい応募がありました。</p>
            <div class="highlight">
              <strong>${engineerName}</strong>さんが応募しました
            </div>
            <p>応募者の詳細を確認して、次のステップに進めてください。</p>
            <a href="${BASE_URL}/company/applications" class="button">応募者を確認</a>
          </div>
          <div class="footer">
            <p>このメールは${APP_NAME}から自動送信されています。</p>
          </div>
        </div>
      </body>
      </html>
    `,
  })
}

export async function sendApplicationStatusEmail(
  engineerEmail: string,
  engineerName: string,
  jobTitle: string,
  status: string
) {
  const statusLabels: Record<string, string> = {
    screening: '書類選考中',
    interview: '面接に進みました',
    offer: 'オファーがあります',
    accepted: '採用が決定しました',
    rejected: '残念ながら見送りとなりました',
  }

  const statusMessage = statusLabels[status] || status

  return sendEmail({
    to: engineerEmail,
    subject: `【${APP_NAME}】応募ステータスが更新されました`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f8fafc; }
          .status-box { background: ${status === 'rejected' ? '#fee2e2' : '#dbeafe'}; border-radius: 8px; padding: 16px; margin: 16px 0; text-align: center; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${APP_NAME}</h1>
          </div>
          <div class="content">
            <h2>${engineerName}さん</h2>
            <p>「${jobTitle}」への応募ステータスが更新されました。</p>
            <div class="status-box">
              <strong style="font-size: 18px;">${statusMessage}</strong>
            </div>
            <p>詳細はダッシュボードでご確認ください。</p>
            <a href="${BASE_URL}/engineer/applications" class="button">応募状況を確認</a>
          </div>
          <div class="footer">
            <p>このメールは${APP_NAME}から自動送信されています。</p>
          </div>
        </div>
      </body>
      </html>
    `,
  })
}

export async function sendNewMessageEmail(
  recipientEmail: string,
  recipientName: string,
  senderName: string,
  conversationId: string
) {
  return sendEmail({
    to: recipientEmail,
    subject: `【${APP_NAME}】${senderName}さんからメッセージが届いています`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f8fafc; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${APP_NAME}</h1>
          </div>
          <div class="content">
            <h2>${recipientName}さん</h2>
            <p><strong>${senderName}</strong>さんから新しいメッセージが届いています。</p>
            <a href="${BASE_URL}/messages/${conversationId}" class="button">メッセージを確認</a>
          </div>
          <div class="footer">
            <p>このメールは${APP_NAME}から自動送信されています。</p>
          </div>
        </div>
      </body>
      </html>
    `,
  })
}

export async function sendContractSignedEmail(
  email: string,
  name: string,
  partnerName: string,
  isCompany: boolean
) {
  const dashboardUrl = isCompany ? `${BASE_URL}/company/contracts` : `${BASE_URL}/engineer/applications`

  return sendEmail({
    to: email,
    subject: `【${APP_NAME}】契約が成立しました`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f8fafc; }
          .success-box { background: #dcfce7; border-radius: 8px; padding: 16px; margin: 16px 0; text-align: center; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${APP_NAME}</h1>
          </div>
          <div class="content">
            <h2>${name}様</h2>
            <div class="success-box">
              <span style="font-size: 24px;">🎉</span>
              <p style="font-size: 18px; margin: 8px 0 0;"><strong>${partnerName}</strong>${isCompany ? 'さん' : ''}との契約が成立しました！</p>
            </div>
            <p>契約の詳細はダッシュボードでご確認いただけます。</p>
            <a href="${dashboardUrl}" class="button">契約を確認</a>
          </div>
          <div class="footer">
            <p>このメールは${APP_NAME}から自動送信されています。</p>
          </div>
        </div>
      </body>
      </html>
    `,
  })
}
