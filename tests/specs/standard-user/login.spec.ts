// tests/specs/standard-user/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';

test.describe('Login Tests', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        await page.goto('/');
    });

    test('standard user login', async ({ page }) => {
        await loginPage.login(
            process.env.STANDARD_USER || '',
            process.env.SAUCE_PASSWORD || ''
        );
        await expect(page.locator(inventoryPage.getProductListSelector())).toBeVisible();
    });

    test('locked user blocked', async ({ page }) => {
        await loginPage.login(
            process.env.LOCKED_OUT_USER || '',
            process.env.SAUCE_PASSWORD || ''
        );
        await expect(page.locator(loginPage.getErrorMessageSelector())).toBeVisible();
        await expect(page.locator(loginPage.getErrorMessageSelector()))
            .toContainText('Epic sadface: Sorry, this user has been locked out');
    });
});