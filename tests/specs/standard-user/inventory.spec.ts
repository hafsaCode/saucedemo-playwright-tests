// tests/specs/standard-user/inventory.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';

test.describe('Inventory Tests', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        await page.goto('/');
        await loginPage.login(
            process.env.STANDARD_USER || '',
            process.env.SAUCE_PASSWORD || ''
        );
    });

    test('product count', async ({ page }) => {
        const productCount = await inventoryPage.getProductCount();
        await expect(productCount).toBe(6);
    });

    test('add to cart', async ({ page }) => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        const cartCount = await inventoryPage.getCartItemCount();
        await expect(cartCount).toBe(1);
    });

    test('remove from cart', async ({ page }) => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await inventoryPage.removeProductFromCart('Sauce Labs Backpack');
        const cartCount = await inventoryPage.getCartItemCount();
        await expect(cartCount).toBe(0);
    });

    test('sort products by price', async ({ page }) => {
        await inventoryPage.sortProducts('hilo');
        const prices = await inventoryPage.getProductPrices();
        // Prüfe ob Preise absteigend sortiert sind
        for (let i = 0; i < prices.length - 1; i++) {
            await expect(prices[i]).toBeGreaterThanOrEqual(prices[i + 1]);
        }
    });
});