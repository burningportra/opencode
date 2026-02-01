import z from "zod"
import path from "path"
import os from "os"
import { Config } from "../config/config"
import { Instance } from "../project/instance"
import { NamedError } from "@opencode-ai/util/error"
import { ConfigMarkdown } from "../config/markdown"
import { Log } from "../util/log"
import { Global } from "@/global"
import { Filesystem } from "@/util/filesystem"
import { Flag } from "@/flag/flag"
import { Bus } from "@/bus"
import { Session } from "@/session"

export namespace Skill {
  const log = Log.create({ service: "skill" })

  export const Category = z.enum(["coding", "devops", "writing", "research", "other"]).default("other")
  export type Category = z.infer<typeof Category>

  export const Info = z.object({
    name: z.string(),
    description: z.string(),
    location: z.string(),
    content: z.string(),
    category: Category,
  })
  export type Info = z.infer<typeof Info>

  function classify(name: string, description: string): Category {
    const text = `${name} ${description}`.toLowerCase()

    const patterns: [Category, RegExp][] = [
      [
        "devops",
        /\b(deploy|deployment|devops|ci\/cd|ci|cd|docker|kubernetes|k8s|terraform|aws|gcp|azure|cloud|infra|infrastructure|pipeline|monitor|monitoring|log|logs|server|service|services|database|redis|postgres|mysql|nginx|helm|ansible|jenkins|github.actions|railway|hosting|uptime|domain|replica|scale|variable|env|config|configuration|template|status)\b/,
      ],
      [
        "coding",
        /\b(code|coding|debug|test|refactor|lint|format|typescript|javascript|python|rust|go|java|bug|fix|implement|develop|program|compile|syntax|api|sdk|library|framework|component|function|class|module|frontend|backend|fullstack|react|next\.js|vue|angular|bun|node|file|read|write|scan)\b/,
      ],
      [
        "writing",
        /\b(write|writing|document|documentation|readme|blog|article|content|copy|proofread|grammar|markdown|prose|technical.writing|changelog|release.notes|docs)\b/,
      ],
      [
        "research",
        /\b(research|analyze|analysis|explore|investigate|audit|review|security|performance|benchmark|profile|optimize|architecture|design|plan|strategy|evaluate|assess|compare|crawl|scrape|search|web|browse|fetch|guidelines|best.practices|tech.debt)\b/,
      ],
    ]

    for (const [cat, pattern] of patterns) {
      if (pattern.test(text)) return cat
    }
    return "other"
  }

  export const InvalidError = NamedError.create(
    "SkillInvalidError",
    z.object({
      path: z.string(),
      message: z.string().optional(),
      issues: z.custom<z.core.$ZodIssue[]>().optional(),
    }),
  )

  export const NameMismatchError = NamedError.create(
    "SkillNameMismatchError",
    z.object({
      path: z.string(),
      expected: z.string(),
      actual: z.string(),
    }),
  )

  const OPENCODE_SKILL_GLOB = new Bun.Glob("{skill,skills}/**/SKILL.md")
  const CLAUDE_SKILL_GLOB = new Bun.Glob("skills/**/SKILL.md")
  const SKILL_GLOB = new Bun.Glob("**/SKILL.md")

  export const state = Instance.state(async () => {
    const skills: Record<string, Info> = {}

    const addSkill = async (match: string) => {
      const md = await ConfigMarkdown.parse(match).catch((err) => {
        const message = ConfigMarkdown.FrontmatterError.isInstance(err)
          ? err.data.message
          : `Failed to parse skill ${match}`
        Bus.publish(Session.Event.Error, { error: new NamedError.Unknown({ message }).toObject() })
        log.error("failed to load skill", { skill: match, err })
        return undefined
      })

      if (!md) return

      const parsed = Info.pick({ name: true, description: true }).safeParse(md.data)
      if (!parsed.success) return

      // Warn on duplicate skill names
      if (skills[parsed.data.name]) {
        log.warn("duplicate skill name", {
          name: parsed.data.name,
          existing: skills[parsed.data.name].location,
          duplicate: match,
        })
      }

      const raw = md.data.category
      const category =
        typeof raw === "string" && Category.removeDefault().safeParse(raw).success
          ? (raw as Category)
          : classify(parsed.data.name, parsed.data.description)

      skills[parsed.data.name] = {
        name: parsed.data.name,
        description: parsed.data.description,
        location: match,
        content: md.content,
        category,
      }
    }

    // Scan .claude/skills/ directories (project-level)
    const claudeDirs = await Array.fromAsync(
      Filesystem.up({
        targets: [".claude"],
        start: Instance.directory,
        stop: Instance.worktree,
      }),
    )
    // Also include global ~/.claude/skills/
    const globalClaude = `${Global.Path.home}/.claude`
    if (await Filesystem.isDir(globalClaude)) {
      claudeDirs.push(globalClaude)
    }

    if (!Flag.OPENCODE_DISABLE_CLAUDE_CODE_SKILLS) {
      for (const dir of claudeDirs) {
        const matches = await Array.fromAsync(
          CLAUDE_SKILL_GLOB.scan({
            cwd: dir,
            absolute: true,
            onlyFiles: true,
            followSymlinks: true,
            dot: true,
          }),
        ).catch((error) => {
          log.error("failed .claude directory scan for skills", { dir, error })
          return []
        })

        for (const match of matches) {
          await addSkill(match)
        }
      }
    }

    // Scan .opencode/skill/ directories
    for (const dir of await Config.directories()) {
      for await (const match of OPENCODE_SKILL_GLOB.scan({
        cwd: dir,
        absolute: true,
        onlyFiles: true,
        followSymlinks: true,
      })) {
        await addSkill(match)
      }
    }

    // Scan additional skill paths from config
    const config = await Config.get()
    for (const skillPath of config.skills?.paths ?? []) {
      const expanded = skillPath.startsWith("~/") ? path.join(os.homedir(), skillPath.slice(2)) : skillPath
      const resolved = path.isAbsolute(expanded) ? expanded : path.join(Instance.directory, expanded)
      if (!(await Filesystem.isDir(resolved))) {
        log.warn("skill path not found", { path: resolved })
        continue
      }
      for await (const match of SKILL_GLOB.scan({
        cwd: resolved,
        absolute: true,
        onlyFiles: true,
        followSymlinks: true,
      })) {
        await addSkill(match)
      }
    }

    return skills
  })

  export async function get(name: string) {
    return state().then((x) => x[name])
  }

  export async function all() {
    return state().then((x) => Object.values(x))
  }
}
