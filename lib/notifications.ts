import { createClient } from '@/lib/supabase/server'
import type { NotificationType } from '@/types/database'

interface CreateNotificationParams {
  profileId: string
  type: NotificationType
  title: string
  body?: string
  link?: string
}

export async function createNotification({
  profileId,
  type,
  title,
  body,
  link,
}: CreateNotificationParams) {
  const supabase = createClient()

  const { error } = await supabase.from('notifications').insert({
    profile_id: profileId,
    type,
    title,
    body,
    link,
  } as never)

  if (error) {
    console.error('Failed to create notification:', error)
  }

  return !error
}

// Helper functions for common notification types
export async function notifyNewApplication(
  companyOwnerId: string,
  engineerName: string,
  jobTitle: string,
  applicationId: string
) {
  return createNotification({
    profileId: companyOwnerId,
    type: 'application',
    title: '新しい応募がありました',
    body: `${engineerName}さんが「${jobTitle}」に応募しました`,
    link: `/company/applications`,
  })
}

export async function notifyApplicationStatusChange(
  engineerOwnerId: string,
  jobTitle: string,
  status: string
) {
  const statusLabels: Record<string, string> = {
    screening: '書類選考中',
    interview: '面接',
    offer: 'オファー',
    accepted: '採用決定',
    rejected: '不採用',
  }

  return createNotification({
    profileId: engineerOwnerId,
    type: 'application',
    title: '応募ステータスが更新されました',
    body: `「${jobTitle}」の応募が「${statusLabels[status] || status}」になりました`,
    link: `/engineer/applications`,
  })
}

export async function notifyNewMessage(
  recipientId: string,
  senderName: string,
  conversationId: string
) {
  return createNotification({
    profileId: recipientId,
    type: 'message',
    title: '新着メッセージ',
    body: `${senderName}さんからメッセージが届きました`,
    link: `/messages/${conversationId}`,
  })
}

export async function notifyContractCreated(
  profileId: string,
  partnerName: string,
  isCompany: boolean
) {
  return createNotification({
    profileId,
    type: 'contract',
    title: '契約が成立しました',
    body: `${partnerName}${isCompany ? 'さん' : ''}との契約が成立しました`,
    link: isCompany ? `/company/contracts` : `/engineer/applications`,
  })
}

export async function notifyScout(
  engineerOwnerId: string,
  companyName: string,
  jobTitle?: string
) {
  return createNotification({
    profileId: engineerOwnerId,
    type: 'scout',
    title: 'スカウトが届きました',
    body: jobTitle
      ? `${companyName}から「${jobTitle}」のスカウトが届きました`
      : `${companyName}からスカウトが届きました`,
    link: `/engineer/messages`,
  })
}
