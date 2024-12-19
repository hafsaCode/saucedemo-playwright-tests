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

    // Login und Warenkorb vorbereiten
    await page.goto('/');
    await loginPage.login(process.env.ERROR_USER || '', process.env.SAUCE_PASSWORD || '');
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.openCart();
  });

  test('finish button does not work', async ({ page }) => {
    await cartPage.proceedToCheckout();
    await checkoutPage.fillInfo('John', 'Doe', '12345');
    await checkoutPage.continue();
    await checkoutPage.finish();
    const successMessage = checkoutPage.getSuccessMessageSelector();
    await expect(page.locator(successMessage)).not.toBeVisible(); // Finish Button schlägt fehl
  });
});
