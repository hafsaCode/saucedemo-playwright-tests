// tests/pages/base.page.ts
import { Page } from '@playwright/test';

export class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Gemeinsame Elemente
    readonly headerLogo = '.app_logo';
    readonly burgerMenu = '#react-burger-menu-btn';
    readonly shoppingCart = '.shopping_cart_link';

    // Gemeinsame Methoden
    async wait(milliseconds: number) {
        await this.page.waitForTimeout(milliseconds);
    }

    async isElementVisible(selector: string) {
        return await this.page.isVisible(selector);
    }

    async getElementText(selector: string) {
        return await this.page.textContent(selector);
    }

    async clickElement(selector: string) {
        await this.page.click(selector);
    }

    // Neue Performance-Methoden
    protected async measureLoadTime(action: () => Promise<void>): Promise<number> {
        const startTime = Date.now();
        await action();
        return Date.now() - startTime;
    }

    protected async waitForElementWithTiming(selector: string, timeout = 30000): Promise<number> {
        const startTime = Date.now();
        await this.page.waitForSelector(selector, { timeout });
        return Date.now() - startTime;
    }

    async getPerformanceMetrics() {
        return await this.page.evaluate(() => {
            const perfData = window.performance.timing;
            return {
                navigationStart: perfData.navigationStart,
                responseEnd: perfData.responseEnd,
                domComplete: perfData.domComplete,
                loadEventEnd: perfData.loadEventEnd,
                totalTime: perfData.loadEventEnd - perfData.navigationStart,
                serverResponseTime: perfData.responseEnd - perfData.requestStart,
                domProcessingTime: perfData.domComplete - perfData.domInteractive
            };
        });
    }

    async waitForNetworkIdle(timeout = 30000) {
        await this.page.waitForLoadState('networkidle', { timeout });
    }

    // Nützliche Methode für Performance-Tests
    async measureActionTime(
        action: () => Promise<void>,
        waitForSelector?: string
    ): Promise<number> {
        const startTime = Date.now();
        await action();
        if (waitForSelector) {
            await this.page.waitForSelector(waitForSelector);
        }
        await this.waitForNetworkIdle();
        return Date.now() - startTime;
    }
}