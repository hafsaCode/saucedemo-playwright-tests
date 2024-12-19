// tests/specs/problem-user/checkout.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';
import { CartPage } from '../../pages/cart.page';
import { CheckoutPage } from '../../pages/checkout.page';

test.describe('Problem User - Checkout Tests', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);

        await page.goto('/');
        await loginPage.login(
            process.env.PROBLEM_USER || '',
            process.env.SAUCE_PASSWORD || ''
        );
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await inventoryPage.openCart();
    });

    test('verify last name field cannot be filled', async ({ page }) => {
        await cartPage.proceedToCheckout();

        // Versuche Formular auszufüllen
        await checkoutPage.fillInfo('John', 'Doe', '12345');

        // Prüfe ob Last Name leer ist
        const lastName = await page.inputValue('[data-test="lastName"]');
        expect(lastName).toBe('');
    });

    test('verify checkout cannot proceed without last name', async ({ page }) => {
        await cartPage.proceedToCheckout();
        
        // Fülle nur Vorname und PLZ aus
        await page.fill('[data-test="firstName"]', 'John');
        await page.fill('[data-test="postalCode"]', '12345');
        
        await checkoutPage.continue();

        // Erwarte Fehlermeldung
        const errorMessage = await page.locator('[data-test="error"]');
        await expect(errorMessage).toBeVisible();
        await expect(errorMessage).toContainText('Error: Last Name is required');
    });
});