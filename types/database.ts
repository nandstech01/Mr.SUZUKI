export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'engineer' | 'company' | 'admin'
export type EngagementType = 'freelance' | 'sidejob' | 'fulltime'
export type JobStatus = 'draft' | 'open' | 'paused' | 'closed'
export type ApplicationStatus = 'applied' | 'screening' | 'interview' | 'offer' | 'accepted' | 'rejected' | 'withdrawn'
export type ContractStatus = 'initiated' | 'signed' | 'active' | 'completed' | 'cancelled'
export type InvoiceStatus = 'pending' | 'paid' | 'void' | 'failed'
export type NotificationType = 'application' | 'message' | 'contract' | 'system' | 'scout'
export type ScoutStatus = 'sent' | 'viewed' | 'replied' | 'declined'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: UserRole
          display_name: string
          email: string | null
          avatar_url: string | null
          locale: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role: UserRole
          display_name: string
          email?: string | null
          avatar_url?: string | null
          locale?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: UserRole
          display_name?: string
          email?: string | null
          avatar_url?: string | null
          locale?: string
          created_at?: string
          updated_at?: string
        }
      }
      company_profiles: {
        Row: {
          id: string
          owner_id: string
          company_name: string
          website_url: string | null
          industry: string | null
          company_size: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          company_name: string
          website_url?: string | null
          industry?: string | null
          company_size?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          company_name?: string
          website_url?: string | null
          industry?: string | null
          company_size?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      engineer_profiles: {
        Row: {
          id: string
          owner_id: string
          headline: string | null
          bio: string | null
          years_of_experience: number | null
          location: string | null
          remote_ok: boolean
          availability_hours_per_week: number | null
          desired_engagement: EngagementType | null
          desired_min_monthly_yen: number | null
          github_url: string | null
          linkedin_url: string | null
          portfolio_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          headline?: string | null
          bio?: string | null
          years_of_experience?: number | null
          location?: string | null
          remote_ok?: boolean
          availability_hours_per_week?: number | null
          desired_engagement?: EngagementType | null
          desired_min_monthly_yen?: number | null
          github_url?: string | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          headline?: string | null
          bio?: string | null
          years_of_experience?: number | null
          location?: string | null
          remote_ok?: boolean
          availability_hours_per_week?: number | null
          desired_engagement?: EngagementType | null
          desired_min_monthly_yen?: number | null
          github_url?: string | null
          linkedin_url?: string | null
          portfolio_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          name: string
          category: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string | null
          created_at?: string
        }
      }
      engineer_skill_links: {
        Row: {
          engineer_profile_id: string
          skill_id: string
          level: number
          years: number | null
        }
        Insert: {
          engineer_profile_id: string
          skill_id: string
          level?: number
          years?: number | null
        }
        Update: {
          engineer_profile_id?: string
          skill_id?: string
          level?: number
          years?: number | null
        }
      }
      job_posts: {
        Row: {
          id: string
          company_profile_id: string
          title: string
          description: string
          engagement: EngagementType
          status: JobStatus
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
        }
        Insert: {
          id?: string
          company_profile_id: string
          title: string
          description: string
          engagement: EngagementType
          status?: JobStatus
          location?: string | null
          remote_ok?: boolean
          weekly_hours_min?: number | null
          weekly_hours_max?: number | null
          duration_months?: number | null
          budget_min_monthly_yen?: number | null
          budget_max_monthly_yen?: number | null
          must_have?: string | null
          nice_to_have?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_profile_id?: string
          title?: string
          description?: string
          engagement?: EngagementType
          status?: JobStatus
          location?: string | null
          remote_ok?: boolean
          weekly_hours_min?: number | null
          weekly_hours_max?: number | null
          duration_months?: number | null
          budget_min_monthly_yen?: number | null
          budget_max_monthly_yen?: number | null
          must_have?: string | null
          nice_to_have?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      job_skill_links: {
        Row: {
          job_post_id: string
          skill_id: string
          weight: number
        }
        Insert: {
          job_post_id: string
          skill_id: string
          weight?: number
        }
        Update: {
          job_post_id?: string
          skill_id?: string
          weight?: number
        }
      }
      applications: {
        Row: {
          id: string
          job_post_id: string
          engineer_profile_id: string
          status: ApplicationStatus
          cover_letter: string | null
          match_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_post_id: string
          engineer_profile_id: string
          status?: ApplicationStatus
          cover_letter?: string | null
          match_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_post_id?: string
          engineer_profile_id?: string
          status?: ApplicationStatus
          cover_letter?: string | null
          match_score?: number
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          job_post_id: string | null
          company_profile_id: string
          engineer_profile_id: string
          created_at: string
        }
        Insert: {
          id?: string
          job_post_id?: string | null
          company_profile_id: string
          engineer_profile_id: string
          created_at?: string
        }
        Update: {
          id?: string
          job_post_id?: string | null
          company_profile_id?: string
          engineer_profile_id?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_profile_id: string
          body: string
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_profile_id: string
          body: string
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_profile_id?: string
          body?: string
          created_at?: string
        }
      }
      contracts: {
        Row: {
          id: string
          application_id: string | null
          company_profile_id: string
          engineer_profile_id: string
          status: ContractStatus
          start_date: string | null
          end_date: string | null
          monthly_fee_yen: number | null
          platform_fee_rate: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          application_id?: string | null
          company_profile_id: string
          engineer_profile_id: string
          status?: ContractStatus
          start_date?: string | null
          end_date?: string | null
          monthly_fee_yen?: number | null
          platform_fee_rate?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          application_id?: string | null
          company_profile_id?: string
          engineer_profile_id?: string
          status?: ContractStatus
          start_date?: string | null
          end_date?: string | null
          monthly_fee_yen?: number | null
          platform_fee_rate?: number
          created_at?: string
          updated_at?: string
        }
      }
      stripe_customers: {
        Row: {
          id: string
          profile_id: string
          stripe_customer_id: string
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          stripe_customer_id: string
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          stripe_customer_id?: string
          created_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          contract_id: string
          stripe_invoice_id: string | null
          amount_yen: number
          status: InvoiceStatus
          billing_month: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          contract_id: string
          stripe_invoice_id?: string | null
          amount_yen: number
          status?: InvoiceStatus
          billing_month?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          contract_id?: string
          stripe_invoice_id?: string | null
          amount_yen?: number
          status?: InvoiceStatus
          billing_month?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      match_weights: {
        Row: {
          id: string
          key: string
          weight: number
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          weight?: number
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          weight?: number
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          profile_id: string
          type: NotificationType
          title: string
          body: string | null
          link: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          type: NotificationType
          title: string
          body?: string | null
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          type?: NotificationType
          title?: string
          body?: string | null
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          contract_id: string
          reviewer_profile_id: string
          reviewee_profile_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          contract_id: string
          reviewer_profile_id: string
          reviewee_profile_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          contract_id?: string
          reviewer_profile_id?: string
          reviewee_profile_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
      scouts: {
        Row: {
          id: string
          company_profile_id: string
          engineer_profile_id: string
          job_post_id: string | null
          message: string
          status: ScoutStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          company_profile_id: string
          engineer_profile_id: string
          job_post_id?: string | null
          message: string
          status?: ScoutStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_profile_id?: string
          engineer_profile_id?: string
          job_post_id?: string | null
          message?: string
          status?: ScoutStatus
          created_at?: string
          updated_at?: string
        }
      }
    }
    Enums: {
      user_role: UserRole
      engagement_type: EngagementType
      job_status: JobStatus
      application_status: ApplicationStatus
      contract_status: ContractStatus
      invoice_status: InvoiceStatus
    }
  }
}
