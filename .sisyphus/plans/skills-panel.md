# Game-like Skills Panel for OpenCode Desktop

## TL;DR

> **Quick Summary**: Add an RPG-style skills/action grid panel as a new tab in the existing left sidebar. Skills inject pre-built prompts or open mini-forms before submitting. Includes an LLM-powered "Improve Prompt" skill following Karpathy's philosophy.
>
> **Deliverables**:
>
> - Skills tab in left sidebar with categorized grid of action cards
> - ~15 hardcoded skills across 4 categories (Coding, Prompt Tools, Project, Custom)
> - Interactive form system for parameterized skills
> - "Improve Prompt" skill using ephemeral LLM session
> - Keyboard shortcut to toggle skills panel
> - E2E Playwright tests
>
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Task 1 → Task 2 → Task 3 → Task 4 → Task 5 → Task 6

---

## Context

### Original Request

User wants a separate panel in the desktop app for a list of skills/actions in an interactive menu format — "like a game." Should show categorized action cards with icons and hover effects, inject prompts or collect parameters via forms before submitting.

### Interview Summary

**Key Discussions**:

- Panel placement: Tab within existing left sidebar (alongside project/session views)
- Visual style: RPG skill tree / grid with icons, categories, hover effects
- Content: Coding tasks, prompt tools, project actions, custom skills
- Behavior: Simple actions inject prompts, complex ones show form first
- Improve Prompt: LLM-powered via ephemeral session
- Custom skills: Hardcoded in v1, extensible config in v2

**Research Findings**:

- Sidebar is a 64px icon rail (`packages/app/src/pages/layout.tsx:2747`) + expandable panel (344px)
- Layout state managed via `createStore` + `persisted()` in `packages/app/src/context/layout.tsx:91-118`
- `fileTree` pattern (layout.tsx:477-516) is the exact model for panel state management
- Commands registered via `command.register()` in layout.tsx:978-1098
- Prompt injection via `usePrompt().set()` — no need to touch prompt-input.tsx
- Icon rail has project icons + settings/help at bottom (layout.tsx:2788-2811)

### Metis Review

**Identified Gaps** (addressed):

- Sidebar collision: Skills panel is a tab, not a new sidebar — no namespace conflict
- Prompt injection race: Use `prompt.set()` which replaces entire state atomically
- LLM streaming: Ephemeral session approach avoids polluting main session history
- Custom skills deferred to v2

---

## Work Objectives

### Core Objective

Add a game-like interactive skills panel as a tab in the existing left sidebar, enabling users to browse and execute categorized actions via visual cards instead of typing prompts.

### Concrete Deliverables

- `packages/app/src/components/skills-panel.tsx` — Main panel component with grid layout
- `packages/app/src/components/skill-card.tsx` — Individual skill card component
- `packages/app/src/components/skill-form.tsx` — Form dialog for parameterized skills
- `packages/app/src/utils/skills.ts` — Skill definitions and types
- `packages/app/src/utils/improve-prompt.ts` — Karpathy-style prompt improvement logic
- Modified `packages/app/src/context/layout.tsx` — Skills tab state
- Modified `packages/app/src/pages/layout.tsx` — Skills icon in sidebar rail + panel rendering + keybind
- Modified `packages/app/src/i18n/en.ts` — i18n strings
- `packages/app/e2e/skills-panel.spec.ts` — E2E tests

### Definition of Done

- [ ] Skills icon visible in sidebar icon rail
- [ ] Clicking skills icon shows/hides skills panel
- [ ] Skills panel shows categorized grid of action cards
- [ ] Clicking a simple skill injects prompt text into prompt input
- [ ] Clicking a form skill opens parameter dialog, then injects
- [ ] "Improve Prompt" skill rewrites current prompt via LLM
- [ ] Keybind toggles skills panel
- [ ] Panel open/closed state persists across reload
- [ ] All E2E tests pass

### Must Have

- Skill categories: Coding, Prompt Tools, Project, Custom
- At least 3-4 skills per category
- Visual hover/active states on cards
- Icons per skill card
- "Improve Prompt" with Karpathy meta-prompt
- Keybind to toggle

### Must NOT Have (Guardrails)

- NO modifications to `prompt-input.tsx` — inject via `usePrompt()` context only
- NO backend/server changes — purely frontend
- NO custom skill loading from disk/config in v1
- NO new npm packages — use existing UI components (`@opencode-ai/ui`)
- NO mocks in tests
- NO `let` statements, `else` blocks, `any` types, unnecessary destructuring
- NO multi-word variable names where single word suffices
- NO explicit type annotations where inference works

---

## Verification Strategy

### Test Decision

- **Infrastructure exists**: YES (Playwright in packages/app)
- **User wants tests**: E2E only
- **Framework**: Playwright

### Automated Verification

Each TODO includes Playwright-based verification. All tests automated — zero user intervention.

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately):
├── Task 1: Skill data model + definitions (utils/skills.ts)
└── Task 2: Improve Prompt logic (utils/improve-prompt.ts)

Wave 2 (After Wave 1):
├── Task 3: Layout context integration (skills tab state)
└── Task 4: SkillCard + SkillForm components

Wave 3 (After Wave 2):
├── Task 5: SkillsPanel + sidebar integration
└── Task 6: E2E tests
```

### Dependency Matrix

| Task | Depends On | Blocks  | Can Parallelize With |
| ---- | ---------- | ------- | -------------------- |
| 1    | None       | 3, 4, 5 | 2                    |
| 2    | None       | 5       | 1                    |
| 3    | 1          | 5       | 4                    |
| 4    | 1          | 5       | 3                    |
| 5    | 2, 3, 4    | 6       | None                 |
| 6    | 5          | None    | None                 |

---

## TODOs

- [ ] 1. Create skill data model and definitions

  **What to do**:
  - Create `packages/app/src/utils/skills.ts`
  - Define `Skill` type: `{ id, name, icon, category, description, type: 'inject' | 'form', prompt?, fields?: SkillField[] }`
  - Define `SkillField` type: `{ id, label, type: 'text' | 'select' | 'file', placeholder?, options? }`
  - Define `SkillCategory`: `'coding' | 'prompt' | 'project' | 'custom'`
  - Create `SKILLS` array with ~15 built-in skills:
    - **Coding**: Fix Bugs, Write Tests, Refactor Code, Add Feature, Explain Code
    - **Prompt Tools**: Improve Prompt (form), Prompt Template (form)
    - **Project**: Analyze Codebase, Find Tech Debt, Generate Docs, Review Changes
    - **Custom**: placeholder category for v2 extensibility
  - Each skill's `prompt` field contains a well-crafted prompt template
  - Form skills have `fields` array describing parameters
  - Export `getSkillsByCategory()` helper that groups skills

  **Must NOT do**:
  - No config file loading
  - No dynamic skill registration
  - No `any` types

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Pure data definition file, no UI complexity
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Understands component data modeling patterns

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 2)
  - **Blocks**: Tasks 3, 4, 5
  - **Blocked By**: None

  **References**:
  - `packages/app/src/components/prompt-input.tsx:108-116` — `SlashCommand` type as a similar pattern for defining actions with id, trigger, title, description, type
  - `packages/app/src/context/command.tsx` — Command registration pattern for how the existing system defines actions
  - `packages/app/src/utils/agent.ts` — Example utility file in the project following naming/style conventions

  **Acceptance Criteria**:

  ```bash
  bun -e "import { SKILLS, getSkillsByCategory } from './packages/app/src/utils/skills'; console.log(SKILLS.length); console.log(Object.keys(getSkillsByCategory()).join(','))"
  # Assert: First line >= 12 (at least 12 skills)
  # Assert: Second line contains "coding,prompt,project"
  ```

  **Commit**: YES
  - Message: `feat(app): add skill data model and built-in skill definitions`
  - Files: `packages/app/src/utils/skills.ts`

---

- [ ] 2. Create Karpathy-style "Improve Prompt" logic

  **What to do**:
  - Create `packages/app/src/utils/improve-prompt.ts`
  - Export `improvePrompt(sdk, prompt, model)` async function
  - Function creates an ephemeral session via `sdk.client.session.create()`
  - Sends a meta-prompt to the LLM that follows Karpathy's prompt engineering philosophy:
    - Make the prompt specific and detailed
    - Add context and examples where appropriate
    - Break complex tasks into clear steps
    - Specify expected output format
    - Include constraints and edge cases
    - Remove ambiguity
    - Add verification criteria
  - The meta-prompt template: "You are a prompt engineering expert following Andrej Karpathy's philosophy. Improve the following prompt to be more specific, structured, and effective. Return ONLY the improved prompt, no explanation.\n\nOriginal prompt:\n{prompt}"
  - Waits for the complete response (not streaming)
  - Extracts the assistant's response text
  - Cleans up: archives/deletes the ephemeral session
  - Returns the improved prompt string
  - Handle errors gracefully (return original prompt on failure)

  **Must NOT do**:
  - No streaming UI
  - No modifications to session history
  - No `try`/`catch` where avoidable — use `.catch()` chains
  - No `let` statements

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single utility function, clear scope
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Understands SDK interaction patterns

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Task 5
  - **Blocked By**: None

  **References**:
  - `packages/app/src/context/sdk.tsx` — SDK context providing `sdk.client` with `session.create()`, `session.prompt()`, `session.abort()` methods
  - `packages/app/src/components/prompt-input.tsx:1210-1221` — How sessions are created: `client.session.create().then(x => x.data)`
  - `packages/app/src/components/prompt-input.tsx:1581-1591` — How prompts are sent: `client.session.prompt({ sessionID, agent, model, messageID, parts, variant })`
  - `packages/app/src/context/sync.tsx` — Sync context with `sync.data.message[sessionID]` for reading responses
  - `packages/app/src/utils/id.ts` — `Identifier.ascending("message")` for generating message IDs

  **Acceptance Criteria**:

  ```bash
  # Verify file exists and exports correctly
  bun -e "import { improvePrompt } from './packages/app/src/utils/improve-prompt'; console.log(typeof improvePrompt)"
  # Assert: Output is "function"
  ```

  **Commit**: YES
  - Message: `feat(app): add Karpathy-style prompt improvement utility`
  - Files: `packages/app/src/utils/improve-prompt.ts`

---

- [ ] 3. Integrate skills panel state into layout context

  **What to do**:
  - Modify `packages/app/src/context/layout.tsx`
  - Add `skills` field to the layout store (line ~91-118) following the `fileTree` pattern:
    ```
    skills: {
      opened: false,
      tab: "coding" as SkillCategory,
    }
    ```
  - Bump persisted key from `layout.v6` to `layout.v7` (or whatever the current version is) — check the `Persist.global()` call
  - Add `skills` object to the returned layout value (following fileTree pattern at lines 477-516):
    - `opened: createMemo(() => store.skills?.opened ?? false)`
    - `tab: createMemo(() => store.skills?.tab ?? "coding")`
    - `setTab(tab)` — sets active skill category
    - `open()`, `close()`, `toggle()` methods
  - Modify `packages/app/src/pages/layout.tsx`
  - Register `skills.toggle` command in `command.register()` block (line 978+):
    ```
    { id: "skills.toggle", title: "Toggle Skills", category: "View", keybind: "mod+shift+k", onSelect: () => layout.skills.toggle() }
    ```
  - Add i18n strings to `packages/app/src/i18n/en.ts`:
    - `sidebar.skills`: "Skills"
    - `command.skills.toggle`: "Toggle Skills Panel"
    - Category names: `skills.category.coding`, `skills.category.prompt`, `skills.category.project`, `skills.category.custom`

  **Must NOT do**:
  - Don't change the existing sidebar state structure
  - Don't modify fileTree or terminal state
  - Don't add `let` statements

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
    - Reason: Following established patterns, mechanical changes
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Context integration in SolidJS

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 4)
  - **Blocks**: Task 5
  - **Blocked By**: Task 1 (needs SkillCategory type)

  **References**:
  - `packages/app/src/context/layout.tsx:91-118` — Store definition with sidebar, fileTree, terminal, etc. — follow this exact structure
  - `packages/app/src/context/layout.tsx:477-516` — `fileTree` accessor pattern with opened(), open(), close(), toggle(), resize() — replicate this for skills (minus resize)
  - `packages/app/src/pages/layout.tsx:978-1098` — Command registration block — add skills.toggle here
  - `packages/app/src/i18n/en.ts` — i18n string definitions
  - `packages/app/src/utils/persist.ts` — `Persist.global()` pattern for persisted state keys

  **Acceptance Criteria**:

  ```bash
  # Verify layout context compiles with new skills state
  bun run --cwd packages/app typecheck 2>&1 | tail -5
  # Assert: No type errors related to 'skills'

  # Verify i18n strings exist
  bun -e "import en from './packages/app/src/i18n/en'; console.log(en['sidebar.skills'])"
  # Assert: Output is "Skills"
  ```

  **Commit**: YES
  - Message: `feat(app): add skills panel state to layout context`
  - Files: `packages/app/src/context/layout.tsx`, `packages/app/src/pages/layout.tsx`, `packages/app/src/i18n/en.ts`

---

- [ ] 4. Create SkillCard and SkillForm components

  **What to do**:
  - Create `packages/app/src/components/skill-card.tsx`
    - Props: `{ skill: Skill, onSelect: (skill: Skill) => void }`
    - Renders a card with: icon, name, description, category badge
    - Hover effects: scale, glow, border highlight (game-like feel)
    - Active/pressed state styling
    - Use existing `@opencode-ai/ui` components (Icon, Button) where possible
    - Tailwind classes for styling, matching project conventions
  - Create `packages/app/src/components/skill-form.tsx`
    - Props: `{ skill: Skill, onSubmit: (values: Record<string, string>) => void, onCancel: () => void }`
    - Renders a dialog/popover with form fields based on `skill.fields`
    - Support field types: text input, select dropdown, file picker
    - Submit button that collects values and calls onSubmit
    - Uses existing dialog pattern from `@opencode-ai/ui/context/dialog`
    - Interpolates collected values into the skill's prompt template using `{fieldId}` placeholders

  **Must NOT do**:
  - No new npm packages for forms
  - No `any` types
  - No inline styles — use Tailwind only
  - No `let` / `else` patterns

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: UI components with game-like visual design, hover effects, animations
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Visual component design, animation, Tailwind styling

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 3)
  - **Blocks**: Task 5
  - **Blocked By**: Task 1 (needs Skill type)

  **References**:
  - `packages/app/src/utils/skills.ts` (from Task 1) — Skill and SkillField types to render
  - `packages/app/src/components/dialog-select-model.tsx` — Dialog pattern with popover, select lists — follow for SkillForm dialog
  - `packages/app/src/components/session/session-new-view.tsx` — Card-based UI with hover states in the existing codebase
  - `packages/ui/src/components/icon-button.tsx` — IconButton component from @opencode-ai/ui
  - `packages/ui/src/components/button.tsx` — Button component
  - `packages/ui/src/components/icon.tsx` — Icon component with available icon names
  - `packages/app/src/components/dialog-settings.tsx` — Form-like settings dialog with inputs and selects — pattern for SkillForm

  **Acceptance Criteria**:

  ```bash
  # Verify components compile
  bun run --cwd packages/app typecheck 2>&1 | tail -5
  # Assert: No type errors in skill-card.tsx or skill-form.tsx
  ```

  **Commit**: YES
  - Message: `feat(app): add SkillCard and SkillForm components`
  - Files: `packages/app/src/components/skill-card.tsx`, `packages/app/src/components/skill-form.tsx`

---

- [ ] 5. Create SkillsPanel and integrate into sidebar

  **What to do**:
  - Create `packages/app/src/components/skills-panel.tsx`
    - Uses `useLayout().skills` for state (tab, opened)
    - Uses `usePrompt().set()` for injecting prompts
    - Uses `useSDK()` for improve-prompt LLM calls
    - Renders category tabs at the top (Coding, Prompt, Project, Custom)
    - Renders a grid of SkillCard components filtered by active category
    - On simple skill click: directly call `prompt.set([{ type: "text", content: skill.prompt, start: 0, end: skill.prompt.length }], skill.prompt.length)`
    - On form skill click: show SkillForm dialog, on submit interpolate values into prompt template, then inject
    - For "Improve Prompt" skill: read current prompt via `usePrompt().current()`, call `improvePrompt()`, replace prompt with result
    - Show loading spinner during LLM improve-prompt call
    - Game-like visual: category tabs styled as RPG-style tabs, grid with gap, cards with consistent sizing

  - Modify `packages/app/src/pages/layout.tsx`
    - Add skills icon to the sidebar icon rail (around line 2788, the bottom section with settings/help)
    - Add it ABOVE settings: a "zap" or "sparkles" icon button that calls `layout.skills.toggle()`
    - When `layout.skills.opened()` is true AND sidebar is expanded, render `<SkillsPanel />` in place of (or alongside) `<SidebarPanel />`
    - Implementation approach: Add a sidebar mode concept — when skills is open, the expanded panel shows SkillsPanel instead of SidebarPanel. The icon rail stays the same. Skills icon toggles between project view and skills view.

  **Must NOT do**:
  - Don't modify prompt-input.tsx
  - Don't create new sessions for simple skill injection
  - Don't add backend API endpoints
  - Don't use `let` / `else` / `any`

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Main UI integration with game-like styling, complex component composition
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Full panel design, sidebar integration, visual polish

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (Wave 3)
  - **Blocks**: Task 6
  - **Blocked By**: Tasks 2, 3, 4

  **References**:
  - `packages/app/src/components/skills-panel.tsx` — The component being created
  - `packages/app/src/context/layout.tsx:477-516` — `layout.skills` state API (from Task 3)
  - `packages/app/src/context/prompt.tsx` — `usePrompt()` with `.set(prompt, cursor)` and `.current()` for prompt injection
  - `packages/app/src/utils/skills.ts` (from Task 1) — SKILLS array, getSkillsByCategory()
  - `packages/app/src/utils/improve-prompt.ts` (from Task 2) — improvePrompt() function
  - `packages/app/src/pages/layout.tsx:2745-2818` — SidebarContent component: icon rail structure at 2747-2812, expanded panel at 2814-2816. Skills icon goes at ~2788 (above settings). Skills panel rendered conditionally at ~2814.
  - `packages/app/src/pages/layout.tsx:2524-2624` — SidebarPanel component structure to understand the expanded panel pattern
  - `packages/app/src/components/skill-card.tsx` (from Task 4) — SkillCard component
  - `packages/app/src/components/skill-form.tsx` (from Task 4) — SkillForm dialog
  - `packages/app/src/context/sdk.tsx` — useSDK() for LLM calls
  - `packages/app/src/context/local.tsx` — useLocal() for current model/agent

  **Acceptance Criteria**:

  ```bash
  # Verify full typecheck passes
  bun run --cwd packages/app typecheck 2>&1 | tail -5
  # Assert: Exit code 0, no errors
  ```

  For frontend verification (using playwright skill):

  ```
  # Agent executes via playwright browser automation:
  1. Navigate to: http://localhost:4444
  2. Wait for: app to load (selector "[data-component='sidebar-nav-desktop']" visible)
  3. Click: skills icon button in sidebar rail (aria-label "Skills")
  4. Wait for: skills panel to appear
  5. Assert: at least 4 skill cards visible
  6. Click: first skill card in "Coding" category
  7. Assert: prompt input contains injected text
  8. Screenshot: .sisyphus/evidence/task-5-skills-panel.png
  ```

  **Commit**: YES
  - Message: `feat(app): add SkillsPanel component and sidebar integration`
  - Files: `packages/app/src/components/skills-panel.tsx`, `packages/app/src/pages/layout.tsx`

---

- [ ] 6. Write E2E Playwright tests

  **What to do**:
  - Create `packages/app/e2e/skills-panel.spec.ts`
  - Test cases:
    1. **Toggle skills panel**: Click skills icon → panel appears → click again → panel disappears
    2. **Keybind toggle**: Press Cmd+Shift+K → panel opens → press again → closes
    3. **Category navigation**: Click different category tabs → grid updates with category-specific skills
    4. **Simple skill injection**: Click "Fix Bugs" skill → prompt input contains the fix bugs prompt text
    5. **Form skill**: Click "Improve Prompt" or form-type skill → dialog appears → fill fields → submit → prompt updated
    6. **Persistence**: Open skills panel → reload page → panel still open
  - Follow existing E2E patterns in the project
  - Use `bun run test:e2e:local` runner

  **Must NOT do**:
  - No mocks
  - No manual verification steps
  - No flaky timing-based assertions — use proper Playwright waitFor/expect

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
    - Reason: Standard E2E test writing following existing patterns
  - **Skills**: [`playwright`, `frontend-ui-ux`]
    - `playwright`: Browser automation and test writing
    - `frontend-ui-ux`: Understanding of component selectors and DOM structure

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Sequential (final)
  - **Blocks**: None
  - **Blocked By**: Task 5

  **References**:
  - `packages/app/e2e/` — Existing E2E test directory for patterns and test runner config
  - `packages/app/playwright.config.ts` — Playwright configuration
  - `packages/app/README.md:E2E Testing` — Instructions for running E2E tests locally
  - `packages/app/src/components/skills-panel.tsx` (from Task 5) — Component to test, data-\* attributes for selectors
  - `packages/app/src/pages/layout.tsx` (from Task 5) — Skills icon button with aria-label for selection

  **Acceptance Criteria**:

  ```bash
  bun run --cwd packages/app test:e2e:local -- --grep "skills-panel"
  # Assert: All 6 test cases pass
  # Assert: Exit code 0
  ```

  **Commit**: YES
  - Message: `test(app): add E2E tests for skills panel`
  - Files: `packages/app/e2e/skills-panel.spec.ts`

---

## Commit Strategy

| After Task | Message                                                          | Files                                            | Verification           |
| ---------- | ---------------------------------------------------------------- | ------------------------------------------------ | ---------------------- |
| 1          | `feat(app): add skill data model and built-in skill definitions` | utils/skills.ts                                  | bun typecheck          |
| 2          | `feat(app): add Karpathy-style prompt improvement utility`       | utils/improve-prompt.ts                          | bun typecheck          |
| 3          | `feat(app): add skills panel state to layout context`            | context/layout.tsx, pages/layout.tsx, i18n/en.ts | bun typecheck          |
| 4          | `feat(app): add SkillCard and SkillForm components`              | components/skill-card.tsx, skill-form.tsx        | bun typecheck          |
| 5          | `feat(app): add SkillsPanel component and sidebar integration`   | components/skills-panel.tsx, pages/layout.tsx    | bun typecheck + visual |
| 6          | `test(app): add E2E tests for skills panel`                      | e2e/skills-panel.spec.ts                         | bun test:e2e:local     |

---

## Success Criteria

### Verification Commands

```bash
# Typecheck
bun run --cwd packages/app typecheck  # Expected: 0 errors

# E2E
bun run --cwd packages/app test:e2e:local -- --grep "skills-panel"  # Expected: 6 tests pass

# Dev server check
bun run --cwd packages/app dev -- --port 4444  # Navigate to localhost:4444, skills icon visible
```

### Final Checklist

- [ ] Skills icon in sidebar rail
- [ ] Panel shows categorized grid
- [ ] Simple skills inject prompts
- [ ] Form skills show dialog → inject
- [ ] Improve Prompt calls LLM
- [ ] Keybind Cmd+Shift+K toggles
- [ ] State persists across reload
- [ ] All E2E tests pass
- [ ] No modifications to prompt-input.tsx
- [ ] No backend changes
- [ ] No `let`, `else`, `any` in new code
