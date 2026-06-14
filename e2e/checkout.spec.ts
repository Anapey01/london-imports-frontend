import { test, expect } from '@playwright/test';

test('critical path: load homepage and cart', async ({ page }) => {
  // Go to homepage
  await page.goto('/');

  // Expect the title to contain London's Imports
  await expect(page).toHaveTitle(/London's Imports/);

  // Wait for the cart link to be available
  const cartLink = page.locator('a[href="/cart"]').first();
  await cartLink.waitFor({ state: 'visible' });
  
  // Click on the cart link
  await cartLink.click();

  // Expect the URL to contain /cart
  await expect(page).toHaveURL(/.*\/cart/);

  // Expect text indicating the cart is present or empty
  await expect(page.locator('text=Your cart is empty').or(page.locator('text=Shopping Cart'))).toBeVisible();
});
