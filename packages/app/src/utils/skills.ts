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

export type SkillAction = {
  label: string
  prompt: string
}

export const skillActions: Record<string, SkillAction[]> = {
  "git-master": [
    { label: "Commit changes", prompt: "Commit my current changes with a descriptive message" },
    { label: "Squash commits", prompt: "Squash the last few commits into one clean commit" },
    { label: "Find who wrote", prompt: "Find who wrote the code around the current cursor position" },
    { label: "Rebase onto dev", prompt: "Rebase my current branch onto the dev branch" },
  ],
  deploy: [
    { label: "Deploy project", prompt: "Deploy the current project to Railway" },
    { label: "Check status", prompt: "Check the deployment status of my Railway services" },
  ],
  database: [
    { label: "Add Postgres", prompt: "Add a Postgres database to my Railway project" },
    { label: "Add Redis", prompt: "Add a Redis instance to my Railway project" },
    { label: "Connect DB", prompt: "Connect to my existing database and show the connection details" },
  ],
  playwright: [
    { label: "Screenshot URL", prompt: "Take a screenshot of the current page at localhost:3000" },
    { label: "Test login flow", prompt: "Test the login flow on my web application" },
    { label: "Check accessibility", prompt: "Run an accessibility check on the current page" },
  ],
  "dev-browser": [
    { label: "Open page", prompt: "Open http://localhost:3000 in the browser" },
    { label: "Fill a form", prompt: "Navigate to the page with a form and fill it out" },
    { label: "Scrape page", prompt: "Scrape the content from the current page" },
  ],
  firecrawl: [
    { label: "Search the web", prompt: "Search the web for information about " },
    { label: "Read a URL", prompt: "Read and summarize the content at " },
    { label: "Deep research", prompt: "Do deep research on " },
  ],
  "tech-debt-agent": [
    { label: "Audit codebase", prompt: "Analyze the codebase for tech debt and create a remediation plan" },
    { label: "Find issues", prompt: "Find the most critical tech debt issues in this project" },
  ],
  "frontend-design": [
    { label: "Build component", prompt: "Build a polished UI component for " },
    { label: "Redesign page", prompt: "Redesign the current page with modern, distinctive styling" },
  ],
  environment: [
    { label: "Show config", prompt: "Show the current environment configuration for my Railway service" },
    { label: "Set variable", prompt: "Set an environment variable on my Railway service" },
    { label: "Scale replicas", prompt: "Scale the number of replicas for my Railway service" },
  ],
  deployment: [
    { label: "View logs", prompt: "Show the latest deployment logs for my Railway service" },
    { label: "Restart service", prompt: "Restart my Railway service deployment" },
    { label: "Rollback", prompt: "Rollback to the previous deployment" },
  ],
  status: [{ label: "Service health", prompt: "Check the health and status of all my Railway services" }],
  metrics: [{ label: "Resource usage", prompt: "Show CPU, memory, and disk usage for my Railway services" }],
  domain: [
    { label: "Add domain", prompt: "Add a custom domain to my Railway service" },
    { label: "Generate URL", prompt: "Generate a Railway domain for my service" },
  ],
  new: [
    { label: "Create project", prompt: "Create a new Railway project from this repository" },
    { label: "Add service", prompt: "Add a new service to my existing Railway project" },
  ],
  projects: [
    { label: "List projects", prompt: "List all my Railway projects and their status" },
    { label: "Switch project", prompt: "Switch to a different Railway project" },
  ],
  templates: [
    { label: "Browse templates", prompt: "Show available Railway templates for common services" },
    { label: "Deploy template", prompt: "Deploy a service from a Railway template" },
  ],
  railway: [
    { label: "Dashboard", prompt: "Show my Railway project dashboard with services and status" },
    { label: "View logs", prompt: "Show recent logs from my Railway deployment" },
  ],
  "railway-docs": [{ label: "How to...", prompt: "How do I configure " }],
  service: [
    { label: "Rename service", prompt: "Rename my Railway service" },
    { label: "Link services", prompt: "Link two Railway services together" },
  ],
  "web-design-guidelines": [
    { label: "Audit UI", prompt: "Review my UI code for Web Interface Guidelines compliance" },
    { label: "Check a11y", prompt: "Check my interface for accessibility issues" },
  ],
  "vercel-react-best-practices": [
    { label: "Optimize perf", prompt: "Review my React components for performance optimization opportunities" },
    { label: "Check bundles", prompt: "Analyze bundle size and suggest code splitting improvements" },
  ],
  "claude-md-improver": [{ label: "Audit CLAUDE.md", prompt: "Audit and improve the CLAUDE.md files in this project" }],
  "claude-automation-recommender": [
    { label: "Suggest automations", prompt: "Analyze this codebase and recommend Claude Code automations" },
  ],
  "stripe-best-practices": [
    { label: "Setup payments", prompt: "Set up Stripe payment processing following best practices" },
    { label: "Add webhooks", prompt: "Implement Stripe webhook handling with proper verification" },
  ],
  "bun-file-io": [
    { label: "Read files", prompt: "Show how to read files using Bun.file() in this project" },
    { label: "Scan directory", prompt: "Scan a directory for files matching a pattern using Bun.Glob" },
  ],
  rclone: [
    { label: "Upload to S3", prompt: "Upload files to S3-compatible storage using rclone" },
    { label: "Sync to cloud", prompt: "Sync local files to cloud storage" },
  ],
  "git-worktree": [
    { label: "Create worktree", prompt: "Create a new Git worktree for parallel development" },
    { label: "List worktrees", prompt: "List all active Git worktrees" },
  ],
  "gemini-imagegen": [
    { label: "Generate image", prompt: "Generate an image from this description: " },
    { label: "Edit image", prompt: "Edit an existing image with these changes: " },
  ],
  "central-station": [{ label: "Search threads", prompt: "Search Railway Central Station for threads about " }],
  "find-skills": [{ label: "Discover skills", prompt: "Find available skills that can help with " }],
  "skill-creator": [{ label: "Create skill", prompt: "Help me create a new SKILL.md file for " }],
  "create-agent-skills": [{ label: "Write skill", prompt: "Guide me through writing a new Claude Code skill" }],
  "compound-docs": [{ label: "Save solution", prompt: "Capture this solved problem as categorized documentation" }],
  playground: [{ label: "Build explorer", prompt: "Create an interactive HTML playground for " }],
  "hook-development": [{ label: "Create hook", prompt: "Create a new hook for Claude Code plugin automation" }],
  "command-development": [{ label: "Build command", prompt: "Create a new slash command for my Claude Code plugin" }],
  "plugin-structure": [
    { label: "Scaffold plugin", prompt: "Scaffold a new Claude Code plugin with proper directory structure" },
  ],
  "mcp-integration": [{ label: "Add MCP server", prompt: "Integrate an MCP server into my Claude Code plugin" }],
  "agent-development": [{ label: "Create agent", prompt: "Create a new agent for my Claude Code plugin" }],
  "skill-development": [{ label: "Improve skill", prompt: "Review and improve this SKILL.md file" }],
  "agent-browser": [
    { label: "Open page", prompt: "Open a webpage and take a snapshot of interactive elements" },
    { label: "Fill form", prompt: "Navigate to a form and fill it out automatically" },
  ],
  "dhh-rails-style": [{ label: "Review style", prompt: "Review this Rails code for DHH/37signals style compliance" }],
  "andrew-kane-gem-writer": [{ label: "Create gem", prompt: "Create a new Ruby gem following Andrew Kane's patterns" }],
  "dspy-ruby": [{ label: "Build module", prompt: "Create a new DSPy.rb module with type-safe signatures" }],
  "file-todos": [
    { label: "Show todos", prompt: "Show all open file-based todos and their status" },
    { label: "Triage todos", prompt: "Help me triage and prioritize open todos" },
  ],
  "every-style-editor": [{ label: "Review copy", prompt: "Review this text for Every style guide compliance" }],
  "writing-rules": [{ label: "Create rule", prompt: "Create a new hookify rule for automated code review" }],
  "plugin-settings": [{ label: "Add settings", prompt: "Add configurable settings to my Claude Code plugin" }],
  "agent-native-architecture": [
    { label: "Design agents", prompt: "Design an agent-native architecture for this application" },
  ],
  "example-skill": [{ label: "View template", prompt: "Show the reference template for creating a SKILL.md skill" }],
}

export function getActions(skill: Skill): SkillAction[] {
  return skillActions[skill.name] ?? [{ label: `Ask about ${skill.name}`, prompt: `Help me with ${skill.name}` }]
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
