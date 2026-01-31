import { Component, For, Show } from "solid-js"
import { createStore } from "solid-js/store"
import { Dialog } from "@opencode-ai/ui/dialog"
import { Button } from "@opencode-ai/ui/button"
import { TextField } from "@opencode-ai/ui/text-field"
import { Select } from "@opencode-ai/ui/select"
import { Icon, IconProps } from "@opencode-ai/ui/icon"
import type { Skill, SkillField } from "@/utils/skills"

function interpolate(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replace(new RegExp(`\\{${key}\\}`, "g"), value),
    template,
  )
}

const FieldInput: Component<{
  field: SkillField
  value: string
  onChange: (value: string) => void
}> = (props) => {
  return (
    <Show
      when={props.field.type === "select" && props.field.options}
      fallback={
        <TextField
          label={props.field.label}
          placeholder={props.field.placeholder}
          value={props.value}
          onChange={(v) => props.onChange(v)}
          multiline={props.field.type === "text"}
          class="min-h-20"
        />
      }
    >
      <div class="flex flex-col gap-1.5">
        <label class="text-12-medium text-text-muted">{props.field.label}</label>
        <Select
          options={props.field.options ?? []}
          current={props.value}
          placeholder={props.field.placeholder ?? "Select..."}
          onSelect={(v) => props.onChange(v ?? "")}
          variant="secondary"
        />
      </div>
    </Show>
  )
}

export const SkillForm: Component<{
  skill: Skill
  onSubmit: (prompt: string) => void
  onCancel: () => void
}> = (props) => {
  const initial = () =>
    (props.skill.fields ?? []).reduce(
      (acc, field) => {
        acc[field.id] = field.options?.[0] ?? ""
        return acc
      },
      {} as Record<string, string>,
    )

  const [values, setValues] = createStore<Record<string, string>>(initial())

  const handleSubmit = () => {
    const prompt = props.skill.prompt ?? ""
    const result = interpolate(prompt, values)
    props.onSubmit(result)
  }

  const canSubmit = () => {
    const fields = props.skill.fields ?? []
    return fields.every((f) => f.type === "select" || values[f.id]?.trim())
  }

  return (
    <Dialog title={props.skill.name}>
      <div class="flex flex-col gap-4 py-2">
        <div class="flex items-center gap-3 pb-2 border-b border-border-base">
          <div class="flex size-10 items-center justify-center rounded-lg bg-surface-raised">
            <Icon name={props.skill.icon as IconProps["name"]} size="normal" />
          </div>
          <p class="text-13-regular text-text-muted">{props.skill.description}</p>
        </div>
        <For each={props.skill.fields}>
          {(field) => (
            <FieldInput field={field} value={values[field.id] ?? ""} onChange={(v) => setValues(field.id, v)} />
          )}
        </For>
        <div class="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={props.onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={!canSubmit()}>
            Execute
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
