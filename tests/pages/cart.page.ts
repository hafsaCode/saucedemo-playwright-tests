// tests/pages/cart.page.ts
import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
    private readonly selectors = {
        checkoutButton: '[data-test="checkout"]',
        continueShoppingButton: '[data-test="continue-shopping"]',
        cartItem: '.cart_item',
        removeButton: '[data-test="remove-sauce-labs-backpack"]',
        cartQuantity: '.cart_quantity'
    };

    constructor(page: Page) {
        super(page);
    }

    // Getter für Test-Assertions
    getCartItemSelector() {
        return this.selectors.cartItem;
    }

    async proceedToCheckout() {
        await this.page.click(this.selectors.checkoutButton);
    }

    async continueShopping() {
        await this.page.click(this.selectors.continueShoppingButton);
    }

    async getCartItemCount() {
        const items = await this.page.locator(this.selectors.cartItem).count();
        return items;
    }

    async removeItem() {
        await this.page.click(this.selectors.removeButton);
    }
}