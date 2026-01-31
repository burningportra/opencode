import { Component } from "solid-js"
import { Icon, IconProps } from "@opencode-ai/ui/icon"
import type { Skill, SkillCategory } from "@/utils/skills"

const categoryColors: Record<SkillCategory, string> = {
  coding: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  prompt: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  project: "bg-green-500/10 text-green-400 border-green-500/20",
  custom: "bg-orange-500/10 text-orange-400 border-orange-500/20",
}

const categoryLabels: Record<SkillCategory, string> = {
  coding: "Coding",
  prompt: "Prompt",
  project: "Project",
  custom: "Custom",
}

export const SkillCard: Component<{
  skill: Skill
  onSelect: (skill: Skill) => void
}> = (props) => {
  return (
    <button
      type="button"
      data-component="skill-card"
      data-skill-id={props.skill.id}
      onClick={() => props.onSelect(props.skill)}
      class="group relative flex flex-col gap-2 p-3 rounded-lg border border-border-base bg-surface-base text-left transition-all duration-200 ease-out hover:scale-[1.02] hover:border-border-active hover:bg-surface-hover hover:shadow-lg hover:shadow-black/10 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-border-active"
    >
      <div class="flex items-start justify-between gap-2">
        <div class="flex size-8 items-center justify-center rounded-md bg-surface-raised transition-colors duration-200 group-hover:bg-surface-raised-stronger">
          <Icon name={props.skill.icon as IconProps["name"]} size="small" />
        </div>
        <span
          class={`shrink-0 rounded-full border px-1.5 py-0.5 text-10-medium ${categoryColors[props.skill.category]}`}
        >
          {categoryLabels[props.skill.category]}
        </span>
      </div>
      <div class="flex flex-col gap-0.5">
        <span class="text-13-medium text-text-base transition-colors duration-200 group-hover:text-text-strong">
          {props.skill.name}
        </span>
        <span class="line-clamp-2 text-11-regular text-text-muted">{props.skill.description}</span>
      </div>
      <div class="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100 bg-gradient-to-br from-white/[0.02] to-transparent" />
    </button>
  )
}
