// tests/specs/visual-tests/layout.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';

test.describe('Visual Layout Tests', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        await page.goto('/');
        await loginPage.login(
            process.env.VISUAL_USER || '',
            process.env.SAUCE_PASSWORD || ''
        );
    });

    test('verify menu icon alignment', async ({ page }) => {
        const menuButton = await page.locator('#react-burger-menu-btn');
        await expect(menuButton).toBeVisible();
        const buttonBox = await menuButton.boundingBox();
        expect(buttonBox).toBeTruthy();
        if (buttonBox) {
            expect(buttonBox.x).toBeLessThan(100);
            expect(buttonBox.y).toBeGreaterThan(0);
        }
    });

    // Überarbeiteter Checkout-Button Test
    test('verify checkout button visibility and functionality', async ({ page }) => {
        // 1. Zum Cart navigieren
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await page.waitForLoadState('networkidle');
        await inventoryPage.openCart();
        await page.waitForLoadState('networkidle');

        // 2. Warten auf Cart Container
        await expect(page.locator('.cart_contents_container')).toBeVisible();

        // 3. Checkout Button finden und prüfen
        const checkoutButton = page.locator('[data-test="checkout"]');
        await expect(checkoutButton).toBeVisible();

        // 4. Prüfen ob der Button im sichtbaren Bereich ist
        const isVisible = await checkoutButton.isVisible();
        expect(isVisible).toBeTruthy();

        // 5. Prüfen ob der Button klickbar ist
        const isEnabled = await checkoutButton.isEnabled();
        expect(isEnabled).toBeTruthy();

        // 6. Prüfen ob der Button im Cart Container ist
        const isInCart = await page.evaluate(() => {
            const button = document.querySelector('[data-test="checkout"]');
            const cart = document.querySelector('.cart_contents_container');
            return button && cart && cart.contains(button);
        });
        expect(isInCart).toBeTruthy();
    });

    test('verify shopping cart alignment', async ({ page }) => {
        const cartIcon = await page.locator('.shopping_cart_link');
        await expect(cartIcon).toBeVisible();
        const cartBox = await cartIcon.boundingBox();
        
        expect(cartBox).toBeTruthy();
        if (cartBox) {
            const viewport = page.viewportSize();
            if (viewport) {
                expect(cartBox.x).toBeGreaterThan(viewport.width / 2);
                expect(cartBox.y).toBeLessThan(100);
            }
        }
    });

    test('check element rotations', async ({ page }) => {
        const elements = [
            '#react-burger-menu-btn',
            '.shopping_cart_link'
        ];

        for (const selector of elements) {
            await expect(page.locator(selector)).toBeVisible();
            const rotation = await page.evaluate((sel) => {
                const element = document.querySelector(sel);
                if (element) {
                    const style = window.getComputedStyle(element);
                    return style.transform;
                }
                return 'none';
            }, selector);

            expect(rotation).toMatch(/^(none|matrix\(1, 0, 0, 1, 0, 0\))$/);
        }
    });
});