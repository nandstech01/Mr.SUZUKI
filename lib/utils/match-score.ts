import type { MatchScoreInput } from '@/types'

// Default weights (can be overridden from match_weights table)
const DEFAULT_WEIGHTS = {
  skill_overlap: 1.5,
  budget_fit: 1.0,
  availability_fit: 1.0,
  remote_fit: 0.5,
}

export function calculateMatchScore(input: MatchScoreInput): number {
  const {
    engineer_skills,
    job_skills,
    engineer_desired_monthly,
    job_budget_min,
    job_budget_max,
    engineer_remote_ok,
    job_remote_ok,
    engineer_availability_hours,
    job_weekly_hours_min,
    job_weekly_hours_max,
  } = input

  let totalScore = 0
  let totalWeight = 0

  // Skill overlap score (0-100)
  if (job_skills.length > 0) {
    const engineerSkillIds = new Set(engineer_skills.map((s) => s.skill_id))
    let skillScore = 0
    let skillWeightSum = 0

    for (const jobSkill of job_skills) {
      if (engineerSkillIds.has(jobSkill.skill_id)) {
        const engineerSkill = engineer_skills.find(
          (s) => s.skill_id === jobSkill.skill_id
        )
        // Score based on level (1-5) * job weight (1-5)
        skillScore += (engineerSkill?.level || 3) * jobSkill.weight
      }
      skillWeightSum += 5 * jobSkill.weight // Max possible score
    }

    const normalizedSkillScore = skillWeightSum > 0
      ? (skillScore / skillWeightSum) * 100
      : 50

    totalScore += normalizedSkillScore * DEFAULT_WEIGHTS.skill_overlap
    totalWeight += DEFAULT_WEIGHTS.skill_overlap
  }

  // Budget fit score (0-100)
  if (engineer_desired_monthly && (job_budget_min || job_budget_max)) {
    let budgetScore = 50 // Default

    if (job_budget_max && engineer_desired_monthly <= job_budget_max) {
      if (job_budget_min && engineer_desired_monthly >= job_budget_min) {
        budgetScore = 100 // Perfect fit
      } else if (job_budget_min) {
        // Below minimum but acceptable
        budgetScore = 80
      } else {
        budgetScore = 90
      }
    } else if (job_budget_max) {
      // Above budget - calculate how much
      const overBudgetRatio = engineer_desired_monthly / job_budget_max
      budgetScore = Math.max(0, 100 - (overBudgetRatio - 1) * 100)
    }

    totalScore += budgetScore * DEFAULT_WEIGHTS.budget_fit
    totalWeight += DEFAULT_WEIGHTS.budget_fit
  }

  // Remote fit score (0-100)
  if (job_remote_ok !== undefined) {
    let remoteScore = 50

    if (job_remote_ok) {
      // Job is remote OK
      remoteScore = 100
    } else if (engineer_remote_ok === false) {
      // Both prefer on-site
      remoteScore = 100
    } else {
      // Job requires on-site but engineer prefers remote
      remoteScore = 30
    }

    totalScore += remoteScore * DEFAULT_WEIGHTS.remote_fit
    totalWeight += DEFAULT_WEIGHTS.remote_fit
  }

  // Availability fit score (0-100)
  if (
    engineer_availability_hours &&
    (job_weekly_hours_min || job_weekly_hours_max)
  ) {
    let availabilityScore = 50

    const minHours = job_weekly_hours_min || 0
    const maxHours = job_weekly_hours_max || 40

    if (
      engineer_availability_hours >= minHours &&
      engineer_availability_hours <= maxHours
    ) {
      availabilityScore = 100
    } else if (engineer_availability_hours > maxHours) {
      availabilityScore = 80 // Has more time than needed
    } else {
      // Less time than minimum required
      const ratio = engineer_availability_hours / minHours
      availabilityScore = Math.max(0, ratio * 100)
    }

    totalScore += availabilityScore * DEFAULT_WEIGHTS.availability_fit
    totalWeight += DEFAULT_WEIGHTS.availability_fit
  }

  // Calculate final score
  if (totalWeight === 0) return 50

  return Math.round(totalScore / totalWeight)
}
