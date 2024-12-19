import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';

test.describe('Error User Tests - Product Detail Page', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  const errorUser = {
    username: process.env.ERROR_USER || '',
    password: process.env.SAUCE_PASSWORD || '',
  };

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    await page.goto('/');
    await loginPage.login(errorUser.username, errorUser.password);

    // Verifiziere, dass der Login erfolgreich war
    const headerLogo = page.locator('.app_logo');
    await expect(headerLogo).toBeVisible();
    console.log(`✅ Eingeloggt als ERROR_USER: ${errorUser.username}`);
  })
});