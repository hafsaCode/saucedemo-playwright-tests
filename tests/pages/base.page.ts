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
}