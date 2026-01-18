import type { Database } from '@/types/database'

// Table row types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type CompanyProfile = Database['public']['Tables']['company_profiles']['Row']
export type EngineerProfile = Database['public']['Tables']['engineer_profiles']['Row']
export type Skill = Database['public']['Tables']['skills']['Row']
export type EngineerSkillLink = Database['public']['Tables']['engineer_skill_links']['Row']
export type JobPost = Database['public']['Tables']['job_posts']['Row']
export type JobSkillLink = Database['public']['Tables']['job_skill_links']['Row']
export type Application = Database['public']['Tables']['applications']['Row']
export type Conversation = Database['public']['Tables']['conversations']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type Contract = Database['public']['Tables']['contracts']['Row']
export type StripeCustomer = Database['public']['Tables']['stripe_customers']['Row']
export type Invoice = Database['public']['Tables']['invoices']['Row']
export type MatchWeight = Database['public']['Tables']['match_weights']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Scout = Database['public']['Tables']['scouts']['Row']

// Insert types
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type CompanyProfileInsert = Database['public']['Tables']['company_profiles']['Insert']
export type EngineerProfileInsert = Database['public']['Tables']['engineer_profiles']['Insert']
export type JobPostInsert = Database['public']['Tables']['job_posts']['Insert']
export type ApplicationInsert = Database['public']['Tables']['applications']['Insert']
export type ConversationInsert = Database['public']['Tables']['conversations']['Insert']
export type MessageInsert = Database['public']['Tables']['messages']['Insert']
export type ContractInsert = Database['public']['Tables']['contracts']['Insert']
export type NotificationInsert = Database['public']['Tables']['notifications']['Insert']
export type ReviewInsert = Database['public']['Tables']['reviews']['Insert']
export type ScoutInsert = Database['public']['Tables']['scouts']['Insert']

// Update types
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']
export type CompanyProfileUpdate = Database['public']['Tables']['company_profiles']['Update']
export type EngineerProfileUpdate = Database['public']['Tables']['engineer_profiles']['Update']
export type JobPostUpdate = Database['public']['Tables']['job_posts']['Update']
export type ApplicationUpdate = Database['public']['Tables']['applications']['Update']
export type ContractUpdate = Database['public']['Tables']['contracts']['Update']

// Extended types with relations
export type EngineerProfileWithSkills = EngineerProfile & {
  profiles?: Profile
  engineer_skill_links?: (EngineerSkillLink & { skills?: Skill })[]
}

export type JobPostWithRelations = JobPost & {
  company_profiles?: CompanyProfile
  job_skill_links?: (JobSkillLink & { skills?: Skill })[]
}

export type ApplicationWithRelations = Application & {
  job_posts?: JobPost & { company_profiles?: CompanyProfile }
  engineer_profiles?: EngineerProfile & { profiles?: Profile }
}

export type ConversationWithRelations = Conversation & {
  company_profiles?: CompanyProfile
  engineer_profiles?: EngineerProfile
  job_posts?: JobPost
}

export type MessageWithSender = Message & {
  profiles?: Profile
}

export type ContractWithRelations = Contract & {
  company_profiles?: CompanyProfile
  engineer_profiles?: EngineerProfile
  applications?: Application
}

export type ReviewWithProfiles = Review & {
  reviewer?: Profile
  reviewee?: Profile
  contracts?: Contract
}
