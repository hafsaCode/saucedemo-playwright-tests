// tests/pages/checkout.page.ts
import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class CheckoutPage extends BasePage {
    private readonly selectors = {
        firstNameInput: '[data-test="firstName"]',
        lastNameInput: '[data-test="lastName"]',
        postalCodeInput: '[data-test="postalCode"]',
        continueButton: '[data-test="continue"]',
        cancelButton: '[data-test="cancel"]',
        finishButton: '[data-test="finish"]',
        errorMessage: '[data-test="error"]',
        summaryContainer: '.checkout_summary_container',
        successMessage: '.complete-header'
    };

    constructor(page: Page) {
        super(page);
    }

    // Getter für Test-Assertions
    getErrorMessageSelector() {
        return this.selectors.errorMessage;
    }

    getSummarySelector() {
        return this.selectors.summaryContainer;
    }

    getSuccessMessageSelector() {
        return this.selectors.successMessage;
    }

    // Standard Formular-Methode
    async fillInfo(firstName: string, lastName: string, postalCode: string) {
        await this.page.fill(this.selectors.firstNameInput, firstName);
        await this.page.fill(this.selectors.lastNameInput, lastName);
        await this.page.fill(this.selectors.postalCodeInput, postalCode);
    }

    // Standard Button-Aktionen
    async continue() {
        await this.page.click(this.selectors.continueButton);
    }

    async cancel() {
        await this.page.click(this.selectors.cancelButton);
    }

    async finish() {
        await this.page.click(this.selectors.finishButton);
    }

    // Erweiterte Formular-Methoden für error_user
    async fillInfoWithValidation(firstName: string, lastName: string, postalCode: string): Promise<{firstName: boolean, lastName: boolean, postalCode: boolean}> {
        const results = {
            firstName: true,
            lastName: true,
            postalCode: true
        };

        results.firstName = await this.tryFill(this.selectors.firstNameInput, firstName);
        results.lastName = await this.tryFill(this.selectors.lastNameInput, lastName);
        results.postalCode = await this.tryFill(this.selectors.postalCodeInput, postalCode);

        return results;
    }

    async tryFinish(): Promise<boolean> {
        const urlBefore = this.page.url();
        await this.tryClick(this.selectors.finishButton);
        await this.page.waitForTimeout(1000);
        const urlAfter = this.page.url();
        return urlBefore !== urlAfter;
    }

    // Hilfsmethoden
    async getInputValue(field: 'firstName' | 'lastName' | 'postalCode'): Promise<string> {
        const selector = this.selectors[`${field}Input`];
        return await this.page.inputValue(selector);
    }

    async getErrorMessage(): Promise<string | null> {
        const errorElement = this.page.locator(this.selectors.errorMessage);
        if (await errorElement.isVisible()) {
            return errorElement.textContent();
        }
        return null;
    }
}