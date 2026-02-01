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

export const skillDescriptions: Record<string, string> = {
  "agent-browser": "Automate browser interactions, form filling, and page scraping via CLI commands",
  "agent-native-architecture": "Design autonomous agent systems with MCP tools and self-modifying loops",
  "agent-development": "Build custom agents and subagents with system prompts for Claude Code plugins",
  "andrew-kane-gem-writer": "Write clean, minimal Ruby gems following Andrew Kane's proven patterns",
  "bun-file-io": "Apply Bun-native file APIs for reading, writing, and scanning project files",
  "central-station": "Search Railway community threads for support answers and feature discussions",
  "claude-automation-recommender": "Scan your codebase and suggest optimal Claude Code hooks, skills, and plugins",
  "claude-md-improver": "Audit and upgrade CLAUDE.md files for better project memory and context",
  "command-development": "Build slash commands with arguments, bash execution, and user prompts",
  "compound-docs": "Capture solved problems as searchable, categorized documentation entries",
  "create-agent-skills": "Author and refine SKILL.md files with best-practice structure and triggers",
  database: "Provision and connect Postgres, Redis, MySQL, or MongoDB to your Railway service",
  deploy: "Push local code to Railway with zero-config deployment in one command",
  deployment: "Manage deployment lifecycle — stop, restart, redeploy, and view logs",
  "dhh-rails-style": "Write Rails code in DHH's 37signals style with REST purity and Hotwire patterns",
  domain: "Configure custom domains, generate Railway URLs, and manage DNS settings",
  "dspy-ruby": "Build type-safe LLM applications in Ruby with DSPy.rb signatures and modules",
  environment: "Set variables, configure builds, scale replicas, and manage service settings",
  "every-style-editor": "Review and edit copy for grammar, punctuation, and Every style compliance",
  "example-skill": "Reference template showing correct SKILL.md format and frontmatter structure",
  "file-todos": "Track tasks with file-based todos, manage status, dependencies, and triage",
  "find-skills": "Discover and install new agent skills to extend Claude Code capabilities",
  firecrawl: "Scrape websites, search the web, and extract clean markdown for LLM context",
  "frontend-design": "Craft distinctive, production-grade UI components that avoid generic aesthetics",
  "gemini-imagegen": "Generate and edit images from text prompts using the Gemini API",
  "git-worktree": "Manage Git worktrees for isolated, parallel feature development branches",
  "hook-development": "Create event-driven hooks for tool validation and session automation",
  "mcp-integration": "Connect external MCP servers to Claude Code plugins for tool integration",
  metrics: "Monitor CPU, memory, network, and disk usage across your Railway services",
  new: "Initialize a new Railway project or add services from GitHub repos",
  playground: "Generate interactive HTML explorers with live preview and copyable output",
  "plugin-settings": "Store per-project plugin configuration using .local.md YAML frontmatter",
  "plugin-structure": "Scaffold Claude Code plugin directories with manifest and auto-discovery",
  projects: "List, switch, rename Railway projects and toggle PR deploy settings",
  railway: "Manage Railway infrastructure — deployments, logs, status, and environment",
  "railway-docs": "Fetch current Railway documentation to answer platform questions accurately",
  rclone: "Upload and sync files to S3, R2, Backblaze, Google Drive, or any cloud storage",
  service: "Rename services, update icons, link dependencies, or create Docker-based services",
  "skill-creator": "Guide for writing effective skills with clear triggers and structured content",
  "skill-development": "Develop and improve SKILL.md files for Claude Code plugin distribution",
  status: "Check what's deployed, running, and healthy across your Railway services",
  "stripe-best-practices": "Implement Stripe payments, subscriptions, webhooks, and Connect platforms",
  "tech-debt-agent": "Scan codebase for tech debt, generate PRDs, and run parallel remediation",
  templates: "Deploy pre-built services like Ghost, Strapi, n8n, Minio, or Uptime Kuma",
  "vercel-react-best-practices": "Optimize React and Next.js performance with Vercel engineering patterns",
  "web-design-guidelines": "Audit UI code against Web Interface Guidelines for accessibility and UX",
  "writing-rules": "Define hookify rules for automated, prompt-based code review enforcement",
}

export function getDescription(skill: Skill): string {
  return skillDescriptions[skill.name] ?? skill.description
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
