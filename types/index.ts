export type {
  Database,
  UserRole,
  EngagementType,
  JobStatus,
  ApplicationStatus,
  ContractStatus,
  InvoiceStatus,
} from './database'

// Profile with role-specific data
export interface ProfileWithDetails {
  id: string
  role: import('./database').UserRole
  display_name: string
  email: string | null
  avatar_url: string | null
  locale: string
  engineer_profile?: import('./database').Database['public']['Tables']['engineer_profiles']['Row'] | null
  company_profile?: import('./database').Database['public']['Tables']['company_profiles']['Row'] | null
}

// Job post with company info
export interface JobPostWithCompany {
  id: string
  company_profile_id: string
  title: string
  description: string
  engagement: import('./database').EngagementType
  status: import('./database').JobStatus
  location: string | null
  remote_ok: boolean
  weekly_hours_min: number | null
  weekly_hours_max: number | null
  duration_months: number | null
  budget_min_monthly_yen: number | null
  budget_max_monthly_yen: number | null
  must_have: string | null
  nice_to_have: string | null
  created_at: string
  updated_at: string
  company_profiles: {
    company_name: string
    website_url: string | null
    industry: string | null
  }
  job_skill_links: Array<{
    skill_id: string
    weight: number
    skills: {
      name: string
      category: string | null
    }
  }>
}

// Application with job and engineer info
export interface ApplicationWithDetails {
  id: string
  job_post_id: string
  engineer_profile_id: string
  status: import('./database').ApplicationStatus
  cover_letter: string | null
  match_score: number
  created_at: string
  updated_at: string
  job_posts: {
    title: string
    company_profiles: {
      company_name: string
    }
  }
  engineer_profiles: {
    headline: string | null
    profiles: {
      display_name: string
      avatar_url: string | null
    }
  }
}

// Conversation with participants
export interface ConversationWithParticipants {
  id: string
  job_post_id: string | null
  company_profile_id: string
  engineer_profile_id: string
  created_at: string
  company_profiles: {
    company_name: string
    profiles: {
      display_name: string
      avatar_url: string | null
    }
  }
  engineer_profiles: {
    headline: string | null
    profiles: {
      display_name: string
      avatar_url: string | null
    }
  }
  job_posts: {
    title: string
  } | null
}

// Match score calculation input
export interface MatchScoreInput {
  engineer_skills: Array<{ skill_id: string; level: number }>
  job_skills: Array<{ skill_id: string; weight: number }>
  engineer_desired_monthly: number | null
  job_budget_min: number | null
  job_budget_max: number | null
  engineer_remote_ok: boolean
  job_remote_ok: boolean
  engineer_availability_hours: number | null
  job_weekly_hours_min: number | null
  job_weekly_hours_max: number | null
}
