import { test, expect } from '@playwright/test';

test.describe('Happy Path — Full Purchase Flow', () => {
  test('browse → product → add to cart → checkout → confirmation', async ({ page }) => {
    // Homepage loads
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('SMILE');

    // Navigate to products
    await page.locator('a[href="/products"]').first().click();
    await page.waitForURL('/products');
    await expect(page.locator('h1')).toContainText('Toys');

    // Click first product
    const firstProduct = page.locator('a[href^="/products/"]').first();
    await firstProduct.click();
    await page.waitForURL('/products/**');

    // Add to cart
    await page.locator('button:has-text("Add to Cart")').click();
    await expect(page.locator('text=added to cart')).toBeVisible({ timeout: 5000 });

    // Open cart and checkout
    await page.locator('[data-cart-toggle]').click();
    await page.locator('a[href="/checkout"]').click();
    await page.waitForURL('/checkout');

    // Fill shipping
    await page.fill('#fullName', 'Priya Sharma');
    await page.fill('#street', '42, Lake View Apartments');
    await page.fill('#city', 'Mumbai');
    await page.fill('#state', 'Maharashtra');
    await page.fill('#pincode', '400001');
    await page.fill('#phone', '+91 98765 43210');
    await page.locator('button:has-text("Continue to Payment")').click();

    // Fill payment
    await page.fill('#nameOnCard', 'Alice Wonder');
    await page.fill('#cardNumber', '4242424242424242');
    await page.fill('#expDate', '12/28');
    await page.fill('#cvc', '123');
    await page.locator('button:has-text("Review Order")').click();

    // Place order
    await page.locator('button:has-text("Place Order")').click();

    // Confirmation page
    await expect(page.locator('text=Order Confirmed')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Mobile Viewport', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('mobile navigation works', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav[aria-label="Mobile navigation"]')).toBeVisible();

    // Tap bottom nav items
    await page.locator('a[href="/products"]').last().click();
    await page.waitForURL('/products');
    await expect(page.locator('h1')).toBeVisible();
  });
});
