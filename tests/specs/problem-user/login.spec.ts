import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';

test.describe('Problem User Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    await page.goto('/');
    await loginPage.login(process.env.PROBLEM_USER || '', process.env.SAUCE_PASSWORD || '');
  });

  test('login successful with UI bugs', async ({ page }) => {
    await expect(page.locator(inventoryPage.getProductListSelector())).toBeVisible();
  });

  test('product images have bugs', async ({ page }) => {
    const images = await page.locator('img.inventory_item_img');
    for (let i = 0; i < await images.count(); i++) {
      const imageSrc = await images.nth(i).getAttribute('src');
      expect(imageSrc).not.toBe(''); // Sicherstellen, dass die Bilder geladen werden
    }
  });

  test('buttons behave incorrectly', async ({ page }) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    const cartCount = await inventoryPage.getCartItemCount();
    await expect(cartCount).not.toBeGreaterThan(1); // Erwarteter UI-Fehler
  });
});
