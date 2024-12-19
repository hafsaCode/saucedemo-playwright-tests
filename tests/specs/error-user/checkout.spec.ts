// tests/specs/error-user/checkout.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';
import { CartPage } from '../../pages/cart.page';
import { CheckoutPage } from '../../pages/checkout.page';

test.describe('Error User Tests - Checkout Page', () => {
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
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await inventoryPage.openCart();
    });

    test('checkout form cannot be completed', async ({ page }) => {
        await cartPage.proceedToCheckout();
        await checkoutPage.fillInfo('John', '', '12345'); // LastName leer lassen
        await checkoutPage.continue();

        const errorMessage = checkoutPage.getErrorMessageSelector();
        await expect(page.locator(errorMessage)).toBeVisible();
        await expect(page.locator(errorMessage)).toContainText('Last Name is required');
    });

    test('finish button does not work', async ({ page }) => {
        await cartPage.proceedToCheckout();
        await checkoutPage.fillInfo('John', 'Doe', '12345');
        await checkoutPage.continue();
        await checkoutPage.finish();

        const successMessage = checkoutPage.getSuccessMessageSelector();
        await expect(page.locator(successMessage)).not.toBeVisible(); // Erfolgsmeldung erscheint nicht
    });
});
