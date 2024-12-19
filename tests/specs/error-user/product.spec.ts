// tests/specs/error-user/product.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';

test.describe('Error User Tests - Product Detail Page', () => {
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

    test('remove button does not work on product detail page', async ({ page }) => {
        await inventoryPage.addProductToCart('Sauce Labs Bike Light');
        await inventoryPage.openProductPage('Sauce Labs Bike Light'); // Detailseite öffnen
        await inventoryPage.removeProductFromCart('Sauce Labs Bike Light');

        const cartCount = await inventoryPage.getCartItemCount();
        expect(cartCount).toBe(1); // Remove-Button reagiert nicht
    });
});
