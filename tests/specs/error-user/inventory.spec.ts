// tests/specs/error-user/inventory.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';

test.describe('Error User Tests - Inventory Page', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        await page.goto('/');
        await loginPage.login(
            process.env.ERROR_USER || '',
            process.env.SAUCE_PASSWORD || ''
        );
    });

    test('add-to-cart button does not work for certain products', async ({ page }) => {
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        const cartCount = await inventoryPage.getCartItemCount();
        expect(cartCount).toBe(0); // Erwartung: Der Warenkorb bleibt leer
    });

    test('remove button does not work for certain products', async ({ page }) => {
        await inventoryPage.addProductToCart('Sauce Labs Bike Light');
        await inventoryPage.removeProductFromCart('Sauce Labs Bike Light');
        const cartCount = await inventoryPage.getCartItemCount();
        expect(cartCount).toBe(1); // Erwartung: Remove-Button funktioniert nicht
    });

    test('sorting functionality shows error popup', async ({ page }) => {
        await inventoryPage.sortProducts('hilo');
        const popup = page.locator('.error-message-container');
        await expect(popup).toBeVisible();
        await expect(popup).toContainText('Sorting is not available');
    });
});
