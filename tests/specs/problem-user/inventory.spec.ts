// tests/specs/problem-user/inventory.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';

test.describe('Problem User - Inventory Tests', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        await page.goto('/');
        await loginPage.login(
            process.env.PROBLEM_USER || '',
            process.env.SAUCE_PASSWORD || ''
        );
    });

    test('verify all product images are identical', async ({ page }) => {
        const images = await page.locator('.inventory_item img').all();
        const firstImageSrc = await images[0].getAttribute('src');
        
        for (const img of images) {
            const src = await img.getAttribute('src');
            expect(src).toBe(firstImageSrc); // Alle Bilder sollten identisch sein
        }
    });

    test('verify add to cart buttons selective functionality', async ({ page }) => {
        // Diese Produkte sollten hinzugefügt werden können
        const addableProducts = [
            'Sauce Labs Backpack',
            'Sauce Labs Bike Light',
            'Sauce Labs Bolt T-Shirt'
        ];

        // Diese nicht
        const nonAddableProducts = [
            'Sauce Labs Fleece Jacket',
            'Sauce Labs Onesie',
            'Test.allTheThings() T-Shirt'
        ];

        // Teste addable Products
        for (const product of addableProducts) {
            await inventoryPage.addProductToCart(product);
            const cartBadge = page.locator('.shopping_cart_badge');
            await expect(cartBadge).toBeVisible();
        }

        // Teste non-addable Products
        for (const product of nonAddableProducts) {
            const addButton = page.locator(`[data-test="add-to-cart-${product.toLowerCase().replace(/\s+/g, '-')}"]`);
            const isEnabled = await addButton.isEnabled();
            expect(isEnabled).toBeFalsy();
        }
    });

    test('verify remove buttons do not work', async ({ page }) => {
        // Füge Produkt hinzu
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        let cartCount = await inventoryPage.getCartItemCount();
        expect(cartCount).toBe(1);

        // Versuche zu entfernen - sollte nicht funktionieren
        await inventoryPage.removeProductFromCart('Sauce Labs Backpack');
        cartCount = await inventoryPage.getCartItemCount();
        expect(cartCount).toBe(1); // Zähler sollte unverändert bleiben
    });

    test('verify sorting does not work', async ({ page }) => {
        // Hole ursprüngliche Produktliste
        const originalProducts = await inventoryPage.getProductNames();

        // Versuche nach Namen zu sortieren
        await inventoryPage.sortProducts('za');
        const sortedProducts = await inventoryPage.getProductNames();

        // Listen sollten identisch sein, da Sortierung nicht funktioniert
        expect(sortedProducts).toEqual(originalProducts);
    });
});