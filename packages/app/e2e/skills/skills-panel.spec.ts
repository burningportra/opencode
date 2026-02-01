import { test, expect } from "../fixtures"
import { defocus, openSidebar } from "../actions"
import { modKey } from "../utils"

const skillsButtonSelector = '[aria-label="Skills"]'
const skillsPanelSelector = '[data-component="skills-panel"]'
const categoryTabSelector = '[data-component="skill-category-tab"]'
const promptSelector = '[data-component="prompt-input"]'

async function openSkillsPanel(page: import("@playwright/test").Page) {
  await openSidebar(page)
  const skillsButton = page.locator(skillsButtonSelector)
  await expect(skillsButton).toBeVisible()
  await skillsButton.click()
  await expect(page.locator(skillsPanelSelector)).toBeVisible()
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
    await expect(panel.getByText("DevOps")).toBeVisible()
    await expect(panel.getByText("Writing")).toBeVisible()
    await expect(panel.getByText("Research")).toBeVisible()
    await expect(panel.getByText("Other")).toBeVisible()
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
