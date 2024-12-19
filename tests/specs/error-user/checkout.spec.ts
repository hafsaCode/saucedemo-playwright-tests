// tests/specs/error-user/checkout.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';
import { CartPage } from '../../pages/cart.page';
import { CheckoutPage } from '../../pages/checkout.page';

test.describe('Error User - Checkout Tests', () => {
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
            process.env.ERROR_USER || '',
            process.env.SAUCE_PASSWORD || ''
        );
        // Füge Produkt zum Warenkorb hinzu
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await inventoryPage.openCart();
    });

    test('verify checkout form and navigation', async ({ page }) => {
        await cartPage.proceedToCheckout();

        // Versuche Formular auszufüllen
        await page.fill('[data-test="firstName"]', 'John');
        // Last Name sollte nicht ausgefüllt werden können
        await page.fill('[data-test="lastName"]', 'Doe');
        await page.fill('[data-test="postalCode"]', '12345');

        // Prüfe ob Last Name leer ist
        const lastName = await page.inputValue('[data-test="lastName"]');
        expect(lastName).toBe('');

        // Trotzdem sollte Continue funktionieren
        await checkoutPage.continue();
        
        // Sollten auf Step Two sein
        await expect(page).toHaveURL(/.*checkout-step-two.html/);
    });

    test('verify finish button does not work', async ({ page }) => {
        await cartPage.proceedToCheckout();
        await page.fill('[data-test="firstName"]', 'John');
        await page.fill('[data-test="postalCode"]', '12345');
        await checkoutPage.continue();

        // Versuche auf Finish zu klicken
        await checkoutPage.finish();
        // Sollten immer noch auf Step Two sein
        await expect(page).toHaveURL(/.*checkout-step-two.html/);

        // Cancel sollte zur Inventory zurückführen
        await page.click('[data-test="cancel"]');
        await expect(page).toHaveURL(/.*inventory.html/);
    });
});