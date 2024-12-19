// tests/specs/performance-user/performance.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';

test.describe('Performance Tests', () => {
    let loginPage: LoginPage;
    let inventoryPage: InventoryPage;
    
    // Angepasste Schwellenwerte für performance_glitch_user
    const THRESHOLDS = {
        NORMAL: 2000,    // 2 Sekunden für normale Aktionen
        SLOW: 6000,      // 6 Sekunden für bekannte langsame Aktionen
        SERVER: 1000     // 1 Sekunde für Server-Response
    };

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        inventoryPage = new InventoryPage(page);
        await page.goto('/');
    });

    test('measure login to inventory load time', async ({ page }) => {
        const startTime = Date.now();

        await loginPage.login(
            process.env.PERFORMANCE_GLITCH_USER || '',
            process.env.SAUCE_PASSWORD || ''
        );
        
        await expect(page.locator('.inventory_list')).toBeVisible();
        const loadTime = Date.now() - startTime;
        console.log(`Login to inventory load time: ${loadTime}ms`);

        // Erwarten höhere Ladezeit für diesen User
        expect(loadTime).toBeLessThan(THRESHOLDS.SLOW);
    });

    test('measure navigation time between pages', async ({ page }) => {
        // Login
        await loginPage.login(
            process.env.PERFORMANCE_GLITCH_USER || '',
            process.env.SAUCE_PASSWORD || ''
        );
        await expect(page.locator('.inventory_list')).toBeVisible();

        // Zeit für Navigation zum Cart messen
        const cartStartTime = Date.now();
        await inventoryPage.openCart();
        await expect(page.locator('.cart_list')).toBeVisible();
        const cartLoadTime = Date.now() - cartStartTime;
        console.log(`Navigation to cart time: ${cartLoadTime}ms`);

        // Zeit für Navigation zurück zum Inventory messen
        const inventoryStartTime = Date.now();
        await page.click('[data-test="continue-shopping"]');
        await expect(page.locator('.inventory_list')).toBeVisible();
        const inventoryLoadTime = Date.now() - inventoryStartTime;
        console.log(`Navigation back to inventory time: ${inventoryLoadTime}ms`);

        // Cart-Navigation sollte schnell sein
        expect(cartLoadTime).toBeLessThan(THRESHOLDS.NORMAL);
        // Zurück zur Inventory-Seite ist bekanntermaßen langsam
        expect(inventoryLoadTime).toBeLessThan(THRESHOLDS.SLOW);
    });

    test('measure add to cart response time', async ({ page }) => {
        await loginPage.login(
            process.env.PERFORMANCE_GLITCH_USER || '',
            process.env.SAUCE_PASSWORD || ''
        );
        await expect(page.locator('.inventory_list')).toBeVisible();

        const startTime = Date.now();
        await inventoryPage.addProductToCart('Sauce Labs Backpack');
        await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
        const responseTime = Date.now() - startTime;
        console.log(`Add to cart response time: ${responseTime}ms`);

        // Warenkorb-Aktionen sollten schnell sein
        expect(responseTime).toBeLessThan(THRESHOLDS.NORMAL);
    });

    test('analyze page load performance metrics', async ({ page }) => {
        const performanceMetrics = await page.evaluate(() => {
            const perfData = window.performance.timing;
            return {
                pageLoadTime: perfData.loadEventEnd - perfData.navigationStart,
                domLoadTime: perfData.domContentLoadedEventEnd - perfData.navigationStart,
                networkLatency: perfData.responseEnd - perfData.fetchStart,
                serverResponseTime: perfData.responseEnd - perfData.requestStart,
                domProcessingTime: perfData.domComplete - perfData.domLoading
            };
        });

        console.log('Performance Metrics:', performanceMetrics);

        // Angepasste Erwartungen für performance_glitch_user
        expect(performanceMetrics.pageLoadTime).toBeLessThan(THRESHOLDS.SLOW);
        expect(performanceMetrics.serverResponseTime).toBeLessThan(THRESHOLDS.SERVER);
        
        // Dokumentiere die Performance-Metriken
        console.log('Detailed Performance Breakdown:');
        console.log(`- Page Load: ${performanceMetrics.pageLoadTime}ms`);
        console.log(`- DOM Load: ${performanceMetrics.domLoadTime}ms`);
        console.log(`- Network Latency: ${performanceMetrics.networkLatency}ms`);
        console.log(`- Server Response: ${performanceMetrics.serverResponseTime}ms`);
        console.log(`- DOM Processing: ${performanceMetrics.domProcessingTime}ms`);
    });
});