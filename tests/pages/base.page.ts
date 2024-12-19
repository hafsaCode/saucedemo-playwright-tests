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

    // Warte-Methoden
    async waitForNetworkIdle(timeout = 30000) {
        await this.page.waitForLoadState('networkidle', { timeout });
    }

    async waitForSelector(selector: string, timeout = 30000) {
        await this.page.waitForSelector(selector, { timeout });
    }

    // Error Handling Methoden
    protected async tryClick(selector: string): Promise<boolean> {
        try {
            await this.page.click(selector);
            return true;
        } catch {
            return false;
        }
    }

    protected async tryFill(selector: string, value: string): Promise<boolean> {
        try {
            await this.page.fill(selector, value);
            const actualValue = await this.page.inputValue(selector);
            return actualValue === value;
        } catch {
            return false;
        }
    }

    // Performance Methoden
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

    // URL und Navigation
    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }

    async waitForUrl(url: string | RegExp, timeout = 30000) {
        await this.page.waitForURL(url, { timeout });
    }

    // Debug-Helfer
    protected async takeScreenshot(name: string) {
        await this.page.screenshot({ 
            path: `screenshots/${name}.png`,
            fullPage: true 
        });
    }

    protected async logConsoleErrors() {
        this.page.on('console', msg => {
            if (msg.type() === 'error') {
                console.error(`Page Error: ${msg.text()}`);
            }
        });
    }
}