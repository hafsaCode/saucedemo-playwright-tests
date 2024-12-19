import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';

test.describe('Visual User Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    await page.goto('/');
    await loginPage.login(process.env.VISUAL_USER || '', process.env.SAUCE_PASSWORD || '');
  });

  test('check layout consistency', async ({ page }) => {
    const header = page.locator('.app_logo');
    await expect(header).toBeVisible();

    const footer = page.locator('.footer_copy');
    await expect(footer).toBeVisible();
  });
});
