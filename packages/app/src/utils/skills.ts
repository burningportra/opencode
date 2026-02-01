import type { IconProps } from "@opencode-ai/ui/icon"
import type { AppSkillsResponse } from "@opencode-ai/sdk/v2/client"

export const CATEGORIES = ["coding", "devops", "writing", "research", "other"] as const
export type SkillCategory = (typeof CATEGORIES)[number]

export type Skill = AppSkillsResponse[number]

export const categoryLabels: Record<SkillCategory, string> = {
  coding: "Coding",
  devops: "DevOps",
  writing: "Writing",
  research: "Research",
  other: "Other",
}

export const categoryIcons: Record<SkillCategory, IconProps["name"]> = {
  coding: "code",
  devops: "console",
  writing: "edit",
  research: "magnifying-glass",
  other: "brain",
}

export const categoryColors: Record<SkillCategory, string> = {
  coding: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  devops: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  writing: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  research: "bg-green-500/10 text-green-400 border-green-500/20",
  other: "bg-gray-500/10 text-gray-400 border-gray-500/20",
}

export function groupByCategory(skills: Skill[]): Record<SkillCategory, Skill[]> {
  const grouped: Record<SkillCategory, Skill[]> = {
    coding: [],
    devops: [],
    writing: [],
    research: [],
    other: [],
  }

  for (const skill of skills) {
    const cat = (skill.category ?? "other") as SkillCategory
    const bucket = grouped[cat] ?? grouped.other
    bucket.push(skill)
  }

  return grouped
}
