import { test, expect } from '@playwright/test';

test.describe('Shopping Flow', () => {
  test('should complete full shopping flow', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h2', { hasText: 'Products' })).toBeVisible();

    const productCards = await page.locator('.product-card').count();
    expect(productCards).toBeGreaterThan(0);

    await page.click('text=Login');

    await page.fill('input[placeholder="Username"]', 'alice');
    await page.fill('input[placeholder="Password"]', 'password123');
    await page.click('button:has-text("Login")');

    await expect(page.locator('text=alice')).toBeVisible();

    await page.click('.product-card:first-child button:has-text("Add to Cart")');

    await page.click('a:has-text("Cart")');

    await expect(page.locator('.cart-item')).toBeVisible();

    await page.click('button:has-text("Proceed to Checkout")');

    await expect(page.locator('h2', { hasText: 'Checkout' })).toBeVisible();

    await page.fill('input[placeholder*="Card"]', '4242424242424242');
    await page.fill('input[placeholder*="MM"]', '12/25');
    await page.fill('input[placeholder*="CVV"]', '123');

    await page.click('button:has-text("Place Order")');

    await expect(page).toHaveURL('/');
  });

  test('should handle cart updates', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[placeholder="Username"]', 'alice');
    await page.fill('input[placeholder="Password"]', 'password123');
    await page.click('button:has-text("Login")');

    await page.goto('/');

    await page.click('.product-card:first-child button:has-text("Add to Cart")');

    await page.click('a:has-text("Cart")');

    await page.click('.cart-item button:has-text("+")');

    const quantity = await page.locator('.quantity').textContent();
    expect(parseInt(quantity || '0')).toBeGreaterThan(1);
  });
});
