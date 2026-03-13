import { expect, test } from '@playwright/test'

test.describe('props', async () => {
  test('results do not change when filtering is disabled', async ({ page }) => {
    await page.goto('/props?shouldFilter=false')
    await expect(page.locator(`[cmdk-item]`)).toHaveCount(2)
    await page.locator(`[cmdk-input]`).type('z')
    await expect(page.locator(`[cmdk-item]`)).toHaveCount(2)
  })

  test('results match against custom filter', async ({ page }) => {
    await page.goto('/props?customFilter=true')
    await page.locator(`[cmdk-input]`).type(`ant`)
    await expect(page.locator(`[cmdk-item]`)).toHaveAttribute('data-value', 'ant')
  })

  test('controlled value', async ({ page }) => {
    await page.goto('/props')
    await expect(page.locator(`[cmdk-item][aria-selected="true"]`)).toHaveAttribute('data-value', 'ant')
    await page.locator(`data-testid=controlledValue`).click()
    await expect(page.locator(`[cmdk-item][aria-selected="true"]`)).toHaveAttribute('data-value', 'anteater')
  })

  test('keep controlled value if empty results', async ({ page }) => {
    await page.goto('/props')
    await expect(page.locator(`[data-testid=value]`)).toHaveText('ant')
    await page.locator(`[cmdk-input]`).fill('d')
    await expect(page.locator(`[data-testid=value]`)).toHaveText('')
    await page.locator(`[cmdk-input]`).fill('ant')
    await expect(page.locator(`[data-testid=value]`)).toHaveText('ant')
  })

  test('controlled search', async ({ page }) => {
    await page.goto('/props')
    await expect(page.locator(`[cmdk-item][aria-selected="true"]`)).toHaveAttribute('data-value', 'ant')
    await page.locator(`data-testid=controlledSearch`).click()
    await expect(page.locator(`[cmdk-item][aria-selected="true"]`)).toHaveAttribute('data-value', 'anteater')
  })

  test('keep focus on the provided initial value', async ({ page }) => {
    await page.goto('/props?initialValue=anteater')
    await expect(page.locator(`[cmdk-item][aria-selected="true"]`)).toHaveAttribute('data-value', 'anteater')
  })

  test('onEmpty is called when search produces no results', async ({ page }) => {
    await page.goto('/props')
    await expect(page.locator(`[data-testid=emptySearch]`)).toHaveText('')
    await page.locator(`[cmdk-input]`).fill('zzz')
    await expect(page.locator(`[data-testid=emptySearch]`)).toHaveText('zzz')
  })

  test('onEmpty is not called when results exist', async ({ page }) => {
    await page.goto('/props')
    await page.locator(`[cmdk-input]`).fill('ant')
    await expect(page.locator(`[data-testid=emptySearch]`)).toHaveText('')
  })
})
