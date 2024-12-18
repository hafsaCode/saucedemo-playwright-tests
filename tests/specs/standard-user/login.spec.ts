// tests/specs/standard-user/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';

test.describe('Standard User Tests', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;

    // Vor jedem Test
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        await page.goto('/'); // Navigiert zur Login-Seite
    });

    // Positiver Test: Erfolgreicher Login
    test('should login successfully as standard user', async ({ page }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        // Korrekte Playwright Erwartung
        await expect(page.locator(inventoryPage.getProductListSelector())).toBeVisible();
    });

    // Negativer Test: Fehlgeschlagener Login
    test('should show error with wrong password', async ({ page }) => {
        await loginPage.login('standard_user', 'wrong_password');
        // Korrekte Playwright Erwartungen
        await expect(page.locator(loginPage.getErrorMessageSelector())).toBeVisible();
        await expect(page.locator(loginPage.getErrorMessageSelector()))
            .toContainText('Username and password do not match');
    });
});