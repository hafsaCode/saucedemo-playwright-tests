import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';

// Ensure environment variables are set
if (!process.env.PERFORMANCE_GLITCH_USER || !process.env.SAUCE_PASSWORD) {
  throw new Error('Environment variables PERFORMANCE_GLITCH_USER and SAUCE_PASSWORD must be set');
}

test.describe('Performance Tests', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test('login time is delayed', async ({ page }) => {
    loginPage = new LoginPage(page);
    const startTime = Date.now();
    await page.goto('/');
    const username = process.env.PERFORMANCE_GLITCH_USER;
    const password = process.env.SAUCE_PASSWORD;
    if (!username || !password) {
      throw new Error('Environment variables PERFORMANCE_GLITCH_USER and SAUCE_PASSWORD must be set');
    }
    await loginPage.login(username, password);
    await expect(page.locator('selector-for-some-element-after-login')).toBeVisible();
    const endTime = Date.now();

    const duration = endTime - startTime;
    console.log(`Login duration: ${duration} ms`);
    expect(duration).toBeGreaterThan(3000); // Erwartete Verzögerung > 3 Sekunden
  });

  test('inventory page loads slowly', async ({ page }) => {
    inventoryPage = new InventoryPage(page);

    const startTime = Date.now();
    await page.goto('/inventory.html');
    await expect(page.locator(inventoryPage.getProductListSelector())).toBeVisible();
    const endTime = Date.now();

    const duration = endTime - startTime;
    console.log(`Inventory load duration: ${duration} ms`);
    expect(duration).toBeGreaterThan(3000); // Verzögerte Ladezeit
  });
});
