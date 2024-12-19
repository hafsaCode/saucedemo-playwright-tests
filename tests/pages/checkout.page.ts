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

    getErrorMessageSelector() {
        return this.selectors.errorMessage;
    }

    getSummarySelector() {
        return this.selectors.summaryContainer;
    }

    getSuccessMessageSelector() {
        return this.selectors.successMessage;
    }

    async fillInfo(firstName: string, lastName: string, postalCode: string) {
        await this.page.fill(this.selectors.firstNameInput, firstName);
        await this.page.fill(this.selectors.lastNameInput, lastName);
        await this.page.fill(this.selectors.postalCodeInput, postalCode);
    }

    async continue() {
        await this.page.click(this.selectors.continueButton);
    }

    async cancel() {
        await this.page.click(this.selectors.cancelButton);
        // Kein explizites Warten hier - das überlassen wir dem Test
    }

    async finish() {
        await this.page.click(this.selectors.finishButton);
    }
}