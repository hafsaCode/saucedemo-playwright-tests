// tests/specs/standard-user/checkout.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';
import { CartPage } from '../../pages/cart.page';
import { CheckoutPage } from '../../pages/checkout.page';

test.describe('Checkout Tests', () => {
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
            process.env.STANDARD_USER || '',
            process.env.SAUCE_PASSWORD || ''
        );
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await inventoryPage.openCart();
    });

    test('complete checkout', async ({ page }) => {
        await cartPage.proceedToCheckout();
        await checkoutPage.fillInfo('John', 'Doe', '12345');
        await checkoutPage.continue();
        await expect(page.locator(checkoutPage.getSummarySelector())).toBeVisible();
        await checkoutPage.finish();
        await expect(page.locator(checkoutPage.getSuccessMessageSelector()))
            .toContainText('Thank you for your order');
    });

    test('checkout without info', async ({ page }) => {
        await cartPage.proceedToCheckout();
        await checkoutPage.continue();
        await expect(page.locator(checkoutPage.getErrorMessageSelector())).toBeVisible();
    });

    test('cancel checkout', async ({ page }) => {
        await cartPage.proceedToCheckout();
        
        // Bestätige, dass wir auf der Checkout-Seite sind
        await expect(page).toHaveURL(/.*\/checkout-step-one.html/);
        
        // Cancel klicken
        await checkoutPage.cancel();
        
        // Warte auf Navigation zum Cart
        await page.waitForURL(/.*\/cart.html/);
        
        // Überprüfe Cart-Elemente
        await expect(page.locator('.cart_list')).toBeVisible();
        await expect(page.locator('.cart_item')).toBeVisible();
        
        // Optional: Überprüfe, ob das ursprüngliche Produkt noch im Cart ist
        const itemTitle = await page.locator('.inventory_item_name').textContent();
        expect(itemTitle).toBe('Sauce Labs Backpack');
    });
});