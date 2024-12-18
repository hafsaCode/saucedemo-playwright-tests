// tests/pages/inventory.page.ts
import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class InventoryPage extends BasePage {
    // Private Selektoren
    private readonly selectors = {
        productList: '.inventory_list',
        inventoryItem: '.inventory_item',
        sortDropdown: '[data-test="product_sort_container"]'
    };

    constructor(page: Page) {
        super(page);
    }

    // Getter für Selektoren (für Tests)
    getProductListSelector() {
        return this.selectors.productList;
    }

    // Methoden für Interaktionen
    async addProductToCart(productName: string) {
        const productCard = await this.page.locator(this.selectors.inventoryItem)
            .filter({ hasText: productName });
        await productCard.locator('[data-test^="add-to-cart"]').click();
    }

    async isOnInventoryPage() {
        return await this.page.isVisible(this.selectors.productList);
    }
}