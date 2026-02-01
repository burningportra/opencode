import { Component, createMemo, createResource, createSignal, For, Show } from "solid-js"
import { createGlobalEmitter } from "@solid-primitives/event-bus"
import { useLayout } from "@/context/layout"
import { useLanguage } from "@/context/language"
import { useGlobalSDK } from "@/context/global-sdk"
import { CATEGORIES, groupByCategory, categoryLabels, categoryIcons, type SkillCategory } from "@/utils/skills"
import { SkillCard } from "./skill-card"
import { Icon } from "@opencode-ai/ui/icon"

export const skillEmitter = createGlobalEmitter<{ inject: string }>()

export const SkillsPanel: Component = () => {
  const layout = useLayout()
  const language = useLanguage()
  const sdk = useGlobalSDK()

  const [skills] = createResource(async () => {
    const response = await sdk.client.app.skills()
    return response.data ?? []
  })

  const grouped = createMemo(() => {
    const groups = groupByCategory(skills() ?? [])
    return CATEGORIES.filter((cat) => groups[cat].length > 0).map((cat) => ({
      category: cat,
      label: categoryLabels[cat],
      icon: categoryIcons[cat],
      skills: groups[cat],
    }))
  })

  const [expanded, setExpanded] = createSignal<string | null>(null)

  const handleAction = (prompt: string) => {
    skillEmitter.emit("inject", prompt)
  }

  return (
    <div class="flex h-full flex-col overflow-hidden" data-component="skills-panel">
      <div class="shrink-0 border-b border-border-base px-3 py-2">
        <h2 class="text-14-medium text-text-strong">{language.t("sidebar.skills")}</h2>
      </div>

      <div class="flex-1 min-h-0 overflow-y-auto p-3">
        <Show when={skills.loading}>
          <div class="flex flex-col gap-2">
            <For each={[1, 2, 3]}>
              {() => <div class="h-16 rounded-lg border border-border-base bg-surface-base animate-pulse" />}
            </For>
          </div>
        </Show>

        <Show when={skills.error}>
          <div class="flex flex-col items-center justify-center gap-3 py-8 text-center">
            <Icon name="circle-x" size="large" class="text-icon-weak-base" />
            <p class="text-13-regular text-text-muted">Failed to load skills</p>
          </div>
        </Show>

        <Show when={!skills.loading && !skills.error && (skills() ?? []).length === 0}>
          <div class="flex flex-col items-center justify-center gap-3 py-8 text-center">
            <Icon name="brain" size="large" class="text-icon-weak-base" />
            <p class="text-13-medium text-text-muted">No skills found</p>
            <p class="text-11-regular text-text-muted px-4">Add SKILL.md files to .opencode/skill/ to get started</p>
          </div>
        </Show>

        <Show when={!skills.loading && !skills.error && grouped().length > 0}>
          <div class="flex flex-col gap-4">
            <For each={grouped()}>
              {(group) => (
                <div class="flex flex-col gap-1.5">
                  <div class="flex items-center gap-1.5 px-1 py-1">
                    <Icon name={group.icon} size="small" class="text-icon-weak-base" />
                    <span class="text-11-medium text-text-muted uppercase tracking-wider">{group.label}</span>
                    <span class="text-11-regular text-text-muted">({group.skills.length})</span>
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <For each={group.skills}>
                      {(skill) => (
                        <SkillCard
                          skill={skill}
                          expanded={expanded() === skill.name}
                          onToggle={() => setExpanded((prev) => (prev === skill.name ? null : skill.name))}
                          onAction={handleAction}
                        />
                      )}
                    </For>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>
    </div>
  )
}
