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
       sortErrorMessage: 'text=Sorting is broken!',
       sortErrorOkButton: 'button:has-text("Ok")',
       addToCartButton: (name: string) => `[data-test="add-to-cart-${name.toLowerCase().replace(/[() ]/g, '-')}"]`,
       removeButton: (name: string) => `[data-test="remove-${name.toLowerCase().replace(/[() ]/g, '-')}"]`
   };

   constructor(page: Page) {
       super(page);
   }

   // Basis Getter und Navigation
   getProductListSelector() {
       return this.selectors.productList;
   }

   async openCart() {
       await this.page.click(this.selectors.cartLink);
   }

   // Standard Warenkorb-Aktionen
   async addProductToCart(productName: string) {
       await this.page.click(this.selectors.addToCartButton(productName));
   }

   async removeProductFromCart(productName: string) {
       await this.page.click(this.selectors.removeButton(productName));
   }

   // Standard Sortierung
   async sortProducts(option: 'az' | 'za' | 'lohi' | 'hilo') {
       await this.page.selectOption(this.selectors.sortDropdown, option);
   }

   // Erweiterte Add/Remove Methoden für error_user
   async tryAddProductToCart(productName: string): Promise<boolean> {
       try {
           const countBefore = await this.getCartItemCount();
           await this.page.click(this.selectors.addToCartButton(productName));
           await this.page.waitForTimeout(500);
           const countAfter = await this.getCartItemCount();
           return countAfter > countBefore;
       } catch {
           return false;
       }
   }

   async tryRemoveProductFromCart(productName: string): Promise<boolean> {
       try {
           const countBefore = await this.getCartItemCount();
           await this.page.click(this.selectors.removeButton(productName));
           await this.page.waitForTimeout(500);
           const countAfter = await this.getCartItemCount();
           return countAfter < countBefore;
       } catch {
           return false;
       }
   }

   // Erweiterte Sort Methode für error_user
   async trySort(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<boolean> {
       try {
           await this.page.selectOption(this.selectors.sortDropdown, option);
           // Prüfe auf Fehlermeldung
           const errorMessage = this.page.locator(this.selectors.sortErrorMessage);
           const isError = await errorMessage.isVisible({ timeout: 2000 });
           if (isError) {
               const okButton = this.page.locator(this.selectors.sortErrorOkButton);
               if (await okButton.isVisible()) {
                   await okButton.click();
               }
               return false;
           }
           return true;
       } catch {
           return false;
       }
   }

   // Warenkorb Status
   async getCartItemCount() {
       const badge = await this.page.locator(this.selectors.cartBadge);
       if (await badge.isVisible()) {
           return parseInt(await badge.textContent() || '0');
       }
       return 0;
   }

   // Produkt Informationen
   async getProductCount() {
       return await this.page.locator(this.selectors.inventoryItem).count();
   }

   async getProductNames(): Promise<string[]> {
       await this.page.waitForSelector(this.selectors.productName);
       return await this.page.locator(this.selectors.productName).allTextContents();
   }

   async getProductPrices(): Promise<number[]> {
       await this.page.waitForSelector(this.selectors.productPrice);
       const prices = await this.page.locator(this.selectors.productPrice).allTextContents();
       return prices.map(price => parseFloat(price.replace('$', '')));
   }

   async isProductVisible(productName: string) {
       const product = await this.page.locator(this.selectors.productName).filter({ hasText: productName });
       return await product.isVisible();
   }
}