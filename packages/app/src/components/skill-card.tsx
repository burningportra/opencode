import { Component, For, Show } from "solid-js"
import { Icon } from "@opencode-ai/ui/icon"
import { categoryIcons, getActions, getDescription, type Skill, type SkillCategory } from "@/utils/skills"

export const SkillCard: Component<{
  skill: Skill
  expanded: boolean
  onToggle: () => void
  onAction: (prompt: string) => void
}> = (props) => {
  const icon = () => categoryIcons[(props.skill.category ?? "other") as SkillCategory] ?? "brain"
  const actions = () => getActions(props.skill)
  const single = () => actions().length === 1

  const handleClick = () => {
    if (single()) return props.onAction(actions()[0].prompt)
    props.onToggle()
  }

  return (
    <div
      data-component="skill-card"
      data-skill-id={props.skill.name}
      class="rounded-lg border border-border-base bg-surface-base transition-all duration-200 ease-out"
      classList={{ "border-border-active": props.expanded }}
    >
      <button
        type="button"
        onClick={handleClick}
        class="group flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors duration-200 hover:bg-surface-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-border-active rounded-lg"
      >
        <div class="flex size-8 shrink-0 items-center justify-center rounded-md bg-surface-raised transition-colors duration-200 group-hover:bg-surface-raised-stronger">
          <Icon name={icon()} size="small" />
        </div>
        <div class="flex flex-col gap-0.5 min-w-0 flex-1">
          <span class="text-13-medium text-text-base transition-colors duration-200 group-hover:text-text-strong">
            {props.skill.name}
          </span>
          <span class="truncate text-11-regular text-text-muted">{getDescription(props.skill)}</span>
        </div>
        <Show when={!single()}>
          <div
            class="flex size-5 shrink-0 items-center justify-center text-icon-weak-base transition-transform duration-200"
            classList={{ "rotate-90": props.expanded }}
          >
            <Icon name="chevron-right" size="small" />
          </div>
        </Show>
      </button>

      <Show when={!single()}>
        <div
          class="grid transition-[grid-template-rows] duration-200 ease-out"
          style={{ "grid-template-rows": props.expanded ? "1fr" : "0fr" }}
        >
          <div class="overflow-hidden">
            <div class="flex flex-col gap-0.5 px-3 pb-2 pt-0.5">
              <For each={actions()}>
                {(action) => (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      props.onAction(action.prompt)
                    }}
                    class="flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-12-regular text-text-muted transition-colors duration-150 hover:bg-surface-hover hover:text-text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-border-active"
                  >
                    <span class="size-1 shrink-0 rounded-full bg-current opacity-40" />
                    {action.label}
                  </button>
                )}
              </For>
            </div>
          </div>
        </div>
      </Show>
    </div>
  )
}
