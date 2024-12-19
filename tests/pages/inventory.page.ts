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
       continueShopping: '[data-test="continue-shopping"]',
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

   // Standard Navigation
   async openCart() {
       await this.page.click(this.selectors.cartLink);
   }

   // Performance-Messungen für Cart Navigation
   async openCartWithTiming(): Promise<number> {
       return this.measureActionTime(
           async () => await this.openCart(),
           '.cart_list'
       );
   }

   // Zurück zur Inventory-Seite mit Performance-Messung
   async returnToInventoryWithTiming(): Promise<number> {
       return this.measureActionTime(
           async () => await this.page.click(this.selectors.continueShopping),
           this.selectors.productList
       );
   }

   // Standard Produkt-Aktionen
   async addProductToCart(productName: string) {
       await this.page.click(this.selectors.addToCartButton(productName));
   }

   async removeProductFromCart(productName: string) {
       await this.page.click(this.selectors.removeButton(productName));
   }

   // Performance-Messung für Produkt-Aktionen
   async addProductToCartWithTiming(productName: string): Promise<number> {
       return this.measureActionTime(
           async () => await this.addProductToCart(productName),
           this.selectors.cartBadge
       );
   }

   // Sortierung mit Performance-Messung
   async sortProductsWithTiming(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<number> {
       return this.measureActionTime(
           async () => {
               await this.page.waitForSelector(this.selectors.sortDropdown);
               await this.page.selectOption(this.selectors.sortDropdown, option);
           },
           this.selectors.productList
       );
   }

   // Standard Sortierung
   async sortProducts(option: 'az' | 'za' | 'lohi' | 'hilo') {
       await this.page.waitForSelector(this.selectors.sortDropdown);
       await this.page.selectOption(this.selectors.sortDropdown, option);
       await this.waitForNetworkIdle();
   }

   // Warenkorb Funktionen
   async getCartItemCount() {
       const badge = await this.page.locator(this.selectors.cartBadge);
       if (await badge.isVisible()) {
           return parseInt(await badge.textContent() || '0');
       }
       return 0;
   }

   // Produkt Funktionen
   async getProductCount() {
       return await this.page.locator(this.selectors.inventoryItem).count();
   }

   async getProductPrices(): Promise<number[]> {
       await this.page.waitForSelector(this.selectors.productPrice);
       const prices = await this.page.locator(this.selectors.productPrice).allTextContents();
       return prices.map(price => parseFloat(price.replace('$', '')));
   }

   async getProductNames(): Promise<string[]> {
       await this.page.waitForSelector(this.selectors.productName);
       return await this.page.locator(this.selectors.productName).allTextContents();
   }

   async isProductVisible(productName: string) {
       const product = await this.page.locator(this.selectors.productName).filter({ hasText: productName });
       return await product.isVisible();
   }

   // Seiten-Validierung
   async isOnInventoryPage() {
       return await this.page.isVisible(this.selectors.productList);
   }

   // Performance Metriken
   async getInventoryLoadMetrics() {
       return await this.getPerformanceMetrics();
   }

   // Warten auf vollständiges Laden der Inventory-Seite
   async waitForInventoryLoad(): Promise<number> {
       return await this.waitForElementWithTiming(this.selectors.productList);
   }

   // Detaillierte Performance-Messung für Seitenladezeit
   async getDetailedLoadMetrics() {
       const metrics = {
           initialLoad: 0,
           productsVisible: 0,
           imagesLoaded: 0,
           totalTime: 0
       };

       const startTime = Date.now();

       // Zeit bis Produktliste sichtbar
       metrics.initialLoad = await this.waitForElementWithTiming(this.selectors.productList);

       // Zeit bis alle Produkte sichtbar
       metrics.productsVisible = await this.measureLoadTime(async () => {
           await this.page.waitForSelector(`${this.selectors.inventoryItem}:nth-child(6)`);
       });

       // Zeit bis alle Bilder geladen
       metrics.imagesLoaded = await this.measureLoadTime(async () => {
           await this.page.waitForSelector('.inventory_item img');
       });

       // Warte auf Network Idle
       await this.waitForNetworkIdle();
       metrics.totalTime = Date.now() - startTime;

       return metrics;
   }
}