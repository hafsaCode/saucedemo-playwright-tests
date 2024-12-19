// tests/pages/inventory.page.ts
import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class InventoryPage extends BasePage {
    private readonly selectors = {
        productList: '.inventory_list',
        inventoryItem: '.inventory_item',
        sortDropdown: '.product_sort_container',
        cartBadge: '.shopping_cart_badge',
        cartLink: '.shopping_cart_link',
        productPrice: '.inventory_item_price',
        productName: '.inventory_item_name',
        addToCartButton: (name: string) => `[data-test="add-to-cart-${name.toLowerCase().replace(/ /g, '-')}"]`,
        removeButton: (name: string) => `[data-test="remove-${name.toLowerCase().replace(/ /g, '-')}"]`
    };

    constructor(page: Page) {
        super(page);
    }

    // Getter für Test-Assertions
    getProductListSelector() {
        return this.selectors.productList;
    }

    // Warenkorb öffnen
    async openCart() {
        await this.page.click(this.selectors.cartLink);
    }

    // Produkt zum Warenkorb hinzufügen
    async addProductToCart(productName: string) {
        await this.page.click(this.selectors.addToCartButton(productName));
    }

    // Produkt aus Warenkorb entfernen
    async removeProductFromCart(productName: string) {
        await this.page.click(this.selectors.removeButton(productName));
    }

    // Produkte sortieren mit Wartezeit
    async sortProducts(option: 'az' | 'za' | 'lohi' | 'hilo') {
        await this.page.waitForSelector(this.selectors.sortDropdown);
        await this.page.selectOption(this.selectors.sortDropdown, option);
        await this.page.waitForTimeout(500);
    }

    // Anzahl der Produkte im Warenkorb
    async getCartItemCount() {
        const badge = await this.page.locator(this.selectors.cartBadge);
        if (await badge.isVisible()) {
            return parseInt(await badge.textContent() || '0');
        }
        return 0;
    }

    // Gesamtanzahl der Produkte auf der Seite
    async getProductCount() {
        return await this.page.locator(this.selectors.inventoryItem).count();
    }

    // Alle Produktpreise abrufen
    async getProductPrices(): Promise<number[]> {
        await this.page.waitForSelector(this.selectors.productPrice);
        const prices = await this.page.locator(this.selectors.productPrice).allTextContents();
        return prices.map(price => parseFloat(price.replace('$', '')));
    }

    // Alle Produktnamen abrufen
    async getProductNames(): Promise<string[]> {
        await this.page.waitForSelector(this.selectors.productName);
        return await this.page.locator(this.selectors.productName).allTextContents();
    }

    // Prüfen ob ein bestimmtes Produkt sichtbar ist
    async isProductVisible(productName: string) {
        const product = await this.page.locator(this.selectors.productName).filter({ hasText: productName });
        return await product.isVisible();
    }

    // Prüfen ob wir auf der Inventory Seite sind
    async isOnInventoryPage() {
        return await this.page.isVisible(this.selectors.productList);
    }
}