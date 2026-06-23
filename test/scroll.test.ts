import { expect, test } from '@playwright/test'

test.describe('scroll selected item into view', async () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/scroll')
  })

  // Regression for #389. When a search change selects a new first item, the list
  // must scroll to that item, not the one that was selected before the change.
  // The bug: scrollSelectedIntoView read `[aria-selected="true"]`, which lags one
  // React commit behind the value change, so it scrolled to the stale selection.
  test('scrolls to the new first item after broadening the search (#389)', async ({ page }) => {
    const input = page.locator('[cmdk-input]')
    const list = page.locator('[cmdk-list]')

    // Narrow to a single item far down the list; it becomes the selection.
    await input.fill('item-49')
    await expect(page.locator('[cmdk-item][aria-selected="true"]')).toHaveAttribute('data-value', 'item-49')

    // Broaden: every item returns and "item-00" becomes the selected first item.
    await input.fill('')
    await expect(page.locator('[cmdk-item][aria-selected="true"]')).toHaveAttribute('data-value', 'item-00')

    // The list must be scrolled back to the top (the new selection), not left
    // parked at the stale "item-49" position near the bottom.
    await expect.poll(() => list.evaluate((el) => el.scrollTop)).toBeLessThan(30)
  })
})
