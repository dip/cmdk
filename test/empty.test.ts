import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('the documented empty state stays readable outside the listbox', async ({ page }) => {
  await page.goto('/')
  const input = page.locator('[cmdk-input]')
  const list = page.getByRole('listbox')
  const empty = page.locator('[cmdk-empty]')

  await input.fill('no-match')
  await expect(empty).toHaveText('No results.')
  await expect(page.getByRole('option')).toHaveCount(0)
  const results = await new AxeBuilder({ page }).withRules(['aria-required-children', 'aria-required-parent']).analyze()
  expect(results.violations).toEqual([])
  await expect(list.locator('[cmdk-empty]')).toHaveCount(0)
  expect(await empty.ariaSnapshot()).toContain('No results.')
  await expect(input).toBeFocused()

  // Empty is outside the list's sizer; it must remain visible when that sizer collapses.
  await list.evaluate((element) => {
    element.style.height = 'var(--cmdk-list-height)'
    element.style.overflow = 'hidden'
  })
  await expect(empty).toBeVisible()
  await expect
    .poll(() => list.evaluate((element) => element.style.getPropertyValue('--cmdk-list-height')))
    .toBe('0.0px')

  await input.fill('Item')
  await expect(empty).toHaveCount(0)
  await expect(page.getByRole('option', { selected: true })).toHaveText('Item')
  await input.press('Enter')
  expect(await page.evaluate(() => (window as any).onSelect)).toBe('Item selected')
})
