import { Component, createMemo, For } from "solid-js"
import { createGlobalEmitter } from "@solid-primitives/event-bus"
import { useLayout } from "@/context/layout"
import { useDialog } from "@opencode-ai/ui/context/dialog"
import { useLanguage } from "@/context/language"
import { getSkillsByCategory, type Skill, type SkillCategory } from "@/utils/skills"
import { SkillCard } from "./skill-card"
import { SkillForm } from "./skill-form"

const tabs: SkillCategory[] = ["coding", "prompt", "project", "custom"]

export const skillEmitter = createGlobalEmitter<{ inject: string }>()

export const SkillsPanel: Component = () => {
  const layout = useLayout()
  const dialog = useDialog()
  const language = useLanguage()

  const grouped = createMemo(() => getSkillsByCategory())
  const skills = createMemo(() => grouped()[layout.skills.tab()])

  const injectPrompt = (text: string) => {
    skillEmitter.emit("inject", text)
  }

  const handleSelect = (skill: Skill) => {
    if (skill.type === "form") {
      dialog.show(() => (
        <SkillForm
          skill={skill}
          onSubmit={(text) => {
            dialog.close()
            injectPrompt(text)
          }}
          onCancel={() => dialog.close()}
        />
      ))
      return
    }

    if (skill.prompt) {
      injectPrompt(skill.prompt)
    }
  }

  return (
    <div class="flex h-full flex-col overflow-hidden" data-component="skills-panel">
      <div class="shrink-0 border-b border-border-base px-3 py-2">
        <h2 class="text-14-medium text-text-strong">{language.t("sidebar.skills")}</h2>
      </div>

      <div class="shrink-0 flex gap-1 border-b border-border-base p-2">
        <For each={tabs}>
          {(tab) => (
            <button
              type="button"
              data-component="skill-category-tab"
              data-category={tab}
              onClick={() => layout.skills.setTab(tab)}
              class="flex-1 rounded-md px-2 py-1.5 text-12-medium transition-colors"
              classList={{
                "bg-surface-raised text-text-strong": layout.skills.tab() === tab,
                "text-text-muted hover:text-text-base hover:bg-surface-hover": layout.skills.tab() !== tab,
              }}
            >
              {language.t(`skills.category.${tab}`)}
            </button>
          )}
        </For>
      </div>

      <div class="flex-1 min-h-0 overflow-y-auto p-3">
        <div class="flex flex-col gap-2">
          <For each={skills()}>{(skill) => <SkillCard skill={skill} onSelect={handleSelect} />}</For>
        </div>
      </div>
    </div>
  )
}
