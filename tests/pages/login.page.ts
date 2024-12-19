// tests/pages/login.page.ts
import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
    private readonly selectors = {
        usernameInput: '#user-name',
        passwordInput: '#password',
        loginButton: '#login-button',
        errorMessage: '[data-test="error"]'
    };

    constructor(page: Page) {
        super(page);
    }

    getErrorMessageSelector() {
        return this.selectors.errorMessage;
    }

    async login(username: string, password: string) {
        await this.page.fill(this.selectors.usernameInput, username);
        await this.page.fill(this.selectors.passwordInput, password);
        await this.page.click(this.selectors.loginButton);
    }

    async isOnLoginPage() {
        return await this.page.isVisible(this.selectors.loginButton);
    }

    async getErrorMessage() {
        const errorElement = await this.page.locator(this.selectors.errorMessage);
        if (await errorElement.isVisible()) {
            return await errorElement.textContent();
        }
        return null;
    }
}