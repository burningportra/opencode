export type SkillCategory = "coding" | "prompt" | "project" | "custom"

export type SkillField = {
  id: string
  label: string
  type: "text" | "select" | "file"
  placeholder?: string
  options?: string[]
}

export type Skill = {
  id: string
  name: string
  icon: string
  category: SkillCategory
  description: string
  type: "inject" | "form"
  prompt?: string
  fields?: SkillField[]
}

export const SKILLS: Skill[] = [
  {
    id: "fix-bugs",
    name: "Fix Bugs",
    icon: "circle-x",
    category: "coding",
    description: "Analyze and fix bugs in the codebase",
    type: "inject",
    prompt:
      "Analyze the codebase and fix any bugs you find. Focus on: 1) Logic errors 2) Edge cases 3) Error handling. Explain each fix.",
  },
  {
    id: "write-tests",
    name: "Write Tests",
    icon: "checklist",
    category: "coding",
    description: "Generate comprehensive tests",
    type: "inject",
    prompt:
      "Write comprehensive tests for the codebase. Include unit tests, edge cases, and integration tests where appropriate. Follow existing test patterns.",
  },
  {
    id: "refactor",
    name: "Refactor Code",
    icon: "code",
    category: "coding",
    description: "Improve code quality and structure",
    type: "inject",
    prompt:
      "Refactor the code to improve readability, maintainability, and performance. Preserve existing functionality. Explain your refactoring decisions.",
  },
  {
    id: "add-feature",
    name: "Add Feature",
    icon: "plus",
    category: "coding",
    description: "Implement a new feature",
    type: "form",
    fields: [
      {
        id: "feature",
        label: "Feature Description",
        type: "text",
        placeholder: "Describe the feature you want to add...",
      },
    ],
    prompt: "Implement the following feature: {feature}. Follow existing patterns and conventions in the codebase.",
  },
  {
    id: "explain-code",
    name: "Explain Code",
    icon: "help",
    category: "coding",
    description: "Get a detailed explanation of the code",
    type: "inject",
    prompt:
      "Explain how this codebase works. Describe the architecture, key components, data flow, and important patterns used.",
  },
  {
    id: "improve-prompt",
    name: "Improve Prompt",
    icon: "brain",
    category: "prompt",
    description: "Enhance your prompt using Karpathy's philosophy",
    type: "form",
    fields: [
      {
        id: "prompt",
        label: "Your Prompt",
        type: "text",
        placeholder: "Enter your prompt to improve...",
      },
    ],
    prompt: "{prompt}",
  },
  {
    id: "prompt-template",
    name: "Prompt Template",
    icon: "bubble-5",
    category: "prompt",
    description: "Generate a structured prompt from a template",
    type: "form",
    fields: [
      {
        id: "task",
        label: "Task Type",
        type: "select",
        options: ["Bug Fix", "Feature", "Refactor", "Test", "Docs"],
      },
      {
        id: "details",
        label: "Details",
        type: "text",
        placeholder: "Additional context...",
      },
    ],
    prompt: "I need help with a {task} task. Details: {details}. Please provide a step-by-step approach.",
  },
  {
    id: "analyze-codebase",
    name: "Analyze Codebase",
    icon: "magnifying-glass",
    category: "project",
    description: "Get a comprehensive codebase analysis",
    type: "inject",
    prompt:
      "Perform a comprehensive analysis of this codebase. Identify: 1) Architecture patterns 2) Dependencies 3) Code organization 4) Potential issues 5) Improvement opportunities.",
  },
  {
    id: "find-tech-debt",
    name: "Find Tech Debt",
    icon: "circle-ban-sign",
    category: "project",
    description: "Identify technical debt and issues",
    type: "inject",
    prompt:
      "Identify technical debt in this codebase. Look for: 1) Outdated dependencies 2) Code smells 3) Missing tests 4) Documentation gaps 5) Performance issues. Prioritize by impact.",
  },
  {
    id: "generate-docs",
    name: "Generate Docs",
    icon: "code-lines",
    category: "project",
    description: "Create documentation for the codebase",
    type: "inject",
    prompt:
      "Generate comprehensive documentation for this codebase. Include: 1) Overview 2) Setup instructions 3) API documentation 4) Architecture diagrams (as text) 5) Usage examples.",
  },
  {
    id: "review-changes",
    name: "Review Changes",
    icon: "branch",
    category: "project",
    description: "Review recent code changes",
    type: "inject",
    prompt:
      "Review the recent code changes. Check for: 1) Correctness 2) Code style 3) Performance 4) Security 5) Test coverage. Provide actionable feedback.",
  },
  {
    id: "custom-1",
    name: "Custom Action 1",
    icon: "edit",
    category: "custom",
    description: "User-defined skill (configure in v2)",
    type: "inject",
    prompt: "This is a placeholder for custom user-defined skills. Configure in settings.",
  },
  {
    id: "custom-2",
    name: "Custom Action 2",
    icon: "edit",
    category: "custom",
    description: "User-defined skill (configure in v2)",
    type: "inject",
    prompt: "This is a placeholder for custom user-defined skills. Configure in settings.",
  },
]

export function getSkillsByCategory(): Record<SkillCategory, Skill[]> {
  const grouped: Record<SkillCategory, Skill[]> = {
    coding: [],
    prompt: [],
    project: [],
    custom: [],
  }

  for (const skill of SKILLS) {
    grouped[skill.category].push(skill)
  }

  return grouped
}
