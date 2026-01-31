import { test, expect } from "../fixtures"
import { defocus, openSidebar } from "../actions"
import { modKey } from "../utils"

const skillsButtonSelector = '[aria-label="Skills"]'
const skillsPanelSelector = '[data-component="skills-panel"]'
const skillCardSelector = '[data-component="skill-card"]'
const categoryTabSelector = '[data-component="skill-category-tab"]'
const promptSelector = '[data-component="prompt-input"]'

async function openSkillsPanel(page: import("@playwright/test").Page) {
  await openSidebar(page)
  const skillsButton = page.locator(skillsButtonSelector)
  await expect(skillsButton).toBeVisible()
  await skillsButton.click()
  await expect(page.locator(skillsPanelSelector)).toBeVisible()
}

async function closeSkillsPanel(page: import("@playwright/test").Page) {
  const skillsButton = page.locator(skillsButtonSelector)
  await skillsButton.click()
  await expect(page.locator(skillsPanelSelector)).not.toBeVisible()
}

test.describe("Skills Panel", () => {
  test("skills icon button is visible in sidebar", async ({ page, gotoSession }) => {
    await gotoSession()
    await openSidebar(page)

    const skillsButton = page.locator(skillsButtonSelector)
    await expect(skillsButton).toBeVisible()
  })

  test("clicking skills icon toggles the skills panel", async ({ page, gotoSession }) => {
    await gotoSession()
    await openSidebar(page)

    const skillsButton = page.locator(skillsButtonSelector)
    const skillsPanel = page.locator(skillsPanelSelector)

    await expect(skillsPanel).not.toBeVisible()
    await skillsButton.click()
    await expect(skillsPanel).toBeVisible()
    await skillsButton.click()
    await expect(skillsPanel).not.toBeVisible()
  })

  test("keybind mod+shift+k toggles skills panel", async ({ page, gotoSession }) => {
    await gotoSession()
    await openSidebar(page)
    await defocus(page)

    const skillsPanel = page.locator(skillsPanelSelector)

    await expect(skillsPanel).not.toBeVisible()
    await page.keyboard.press(`${modKey}+Shift+K`)
    await expect(skillsPanel).toBeVisible()
    await page.keyboard.press(`${modKey}+Shift+K`)
    await expect(skillsPanel).not.toBeVisible()
  })

  test("skills panel shows category tabs", async ({ page, gotoSession }) => {
    await gotoSession()
    await openSkillsPanel(page)

    const panel = page.locator(skillsPanelSelector)
    await expect(panel.getByText("Coding")).toBeVisible()
    await expect(panel.getByText("Prompt Tools")).toBeVisible()
    await expect(panel.getByText("Project")).toBeVisible()
    await expect(panel.getByText("Custom")).toBeVisible()
  })

  test("skills panel shows skill cards", async ({ page, gotoSession }) => {
    await gotoSession()
    await openSkillsPanel(page)

    const cards = page
      .locator(skillsPanelSelector)
      .locator("button")
      .filter({ has: page.locator(".text-13-medium") })
    await expect(cards.first()).toBeVisible()
    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(3)
  })

  test("clicking category tab changes displayed skills", async ({ page, gotoSession }) => {
    await gotoSession()
    await openSkillsPanel(page)

    const panel = page.locator(skillsPanelSelector)

    await panel.getByText("Coding", { exact: true }).click()
    await expect(panel.getByText("Fix Bugs")).toBeVisible()

    await panel.getByText("Prompt Tools").click()
    await expect(panel.getByText("Improve Prompt")).toBeVisible()

    await panel.getByText("Project").click()
    await expect(panel.getByText("Analyze Codebase")).toBeVisible()
  })

  test("clicking a simple skill injects prompt text", async ({ page, gotoSession }) => {
    await gotoSession()
    await openSkillsPanel(page)

    const panel = page.locator(skillsPanelSelector)
    await panel.getByText("Coding", { exact: true }).click()

    const fixBugsCard = panel.locator("button").filter({ hasText: "Fix Bugs" }).first()
    await expect(fixBugsCard).toBeVisible()
    await fixBugsCard.click()

    const promptInput = page.locator(promptSelector).locator("textarea, [contenteditable]").first()
    await expect(promptInput).toContainText(/bug|fix/i)
  })

  test("skills panel state persists after page reload", async ({ page, gotoSession }) => {
    await gotoSession()
    await openSkillsPanel(page)

    await page.reload()
    await expect(page.locator(promptSelector)).toBeVisible()

    const skillsPanel = page.locator(skillsPanelSelector)
    await expect(skillsPanel).toBeVisible()
  })
})
