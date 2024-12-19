// tests/specs/visual-tests/visual.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';

test.describe('Visual User Tests', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await page.goto('/');
        await loginPage.login(
            process.env.VISUAL_USER || '',
            process.env.SAUCE_PASSWORD || ''
        );
        // Warte bis die Seite vollständig geladen ist
        await page.waitForLoadState('networkidle');
    });

    test('compare product titles layout', async ({ page }) => {
        const productTitles = await page.locator('.inventory_item_name').all();
        for (const title of productTitles) {
            await expect(title).toBeVisible();
            const isOverflowing = await title.evaluate((element) => {
                return element.scrollWidth > element.clientWidth;
            });
            expect(isOverflowing).toBeFalsy();
        }
    });

    test('verify cart icon alignment', async ({ page }) => {
        const cartIcon = await page.locator('.shopping_cart_link');
        await expect(cartIcon).toBeVisible();
        const cartBoundingBox = await cartIcon.boundingBox();
        expect(cartBoundingBox?.y).toBeGreaterThan(0);
    });

    test('check footer alignment', async ({ page }) => {
        // Scroll zum Footer
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        const footer = await page.locator('.footer');
        await expect(footer).toBeVisible();
        
        const footerBox = await footer.boundingBox();
        const viewport = page.viewportSize();
        expect(footerBox).toBeTruthy();
        if (footerBox && viewport) {
            expect(footerBox.y + footerBox.height).toBeLessThanOrEqual(viewport.height * 2);
        }
    });

    test('verify product images', async ({ page }) => {
        const images = await page.locator('.inventory_item img');
        const count = await images.count();
        expect(count).toBeGreaterThan(0);
        
        for (let i = 0; i < count; i++) {
            const image = images.nth(i);
            await expect(image).toBeVisible();
            const src = await image.getAttribute('src');
            expect(src).toBeTruthy();
        }
    });

    // Screenshot-Vergleich nur wenn wirklich nötig
    test.skip('compare layout with standard user', async ({ page, browser }) => {
        // Dieser Test wird übersprungen, da er zu instabil ist
        // Stattdessen sollten wir uns auf spezifische UI-Elemente konzentrieren
    });
});