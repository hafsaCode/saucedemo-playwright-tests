// tests/pages/login.page.ts
import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
    // Private Selektoren
    private readonly selectors = {
        usernameInput: '#user-name',
        passwordInput: '#password',
        loginButton: '#login-button',
        errorMessage: '[data-test="error"]'
    };

    constructor(page: Page) {
        super(page);
    }

    // Getter für Selektoren (für Tests)
    getErrorMessageSelector() {
        return this.selectors.errorMessage;
    }

    // Login Methode
    async login(username: string, password: string) {
        await this.page.fill(this.selectors.usernameInput, username);
        await this.page.fill(this.selectors.passwordInput, password);
        await this.page.click(this.selectors.loginButton);
    }

    // Methode zum Prüfen, ob wir auf der Login-Seite sind
    async isOnLoginPage() {
        return await this.page.isVisible(this.selectors.loginButton);
    }
}