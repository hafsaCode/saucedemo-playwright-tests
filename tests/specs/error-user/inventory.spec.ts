// tests/specs/error-user/inventory.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';

test.describe('Error User - Inventory Tests', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        await page.goto('/');
        await loginPage.login(
            process.env.ERROR_USER || '',
            process.env.SAUCE_PASSWORD || ''
        );
    });

    test('verify selective add to cart functionality', async ({ page }) => {
        // Add-to-Cart Tests für alle Produkte
        const products = [
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt',
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Onesie',
            'Test.allTheThings() T-Shirt'
        ];

        let addedCount = 0;
        for (const product of products) {
            const cartCountBefore = await inventoryPage.getCartItemCount();
            await inventoryPage.addProductToCart(product);
            const cartCountAfter = await inventoryPage.getCartItemCount();
            
            if (cartCountAfter > cartCountBefore) {
                addedCount++;
            }
        }

        // Prüfe ob genau 3 Produkte hinzugefügt werden konnten
        expect(addedCount).toBe(3);
    });

    test('verify remove button does not work', async ({ page }) => {
        // Füge ein Produkt hinzu, das wir hinzufügen können
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        const cartBadge = page.locator('.shopping_cart_badge');
        await expect(cartBadge).toHaveText('1');

        // Versuche es zu entfernen
        await inventoryPage.removeProductFromCart('Sauce Labs Backpack');
        // Badge sollte immer noch '1' anzeigen
        await expect(cartBadge).toHaveText('1');
    });

    test('verify sort error message appears', async ({ page }) => {
        // Klicke auf Sort-Dropdown
        await page.locator('.product_sort_container').click();
        await page.selectOption('.product_sort_container', 'az');

        // Prüfe ob Fehlermeldung erscheint
        const errorDialog = page.locator('text="Sorting is broken! This error has been reported to Backtrace."');
        await expect(errorDialog).toBeVisible();

        // Prüfe ob OK Button vorhanden ist
        const okButton = page.locator('text="Ok"');
        await expect(okButton).toBeVisible();

        // Klicke OK
        await okButton.click();
    });
});