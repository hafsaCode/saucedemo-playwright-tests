// tests/pages/cart.page.ts
import { Page } from '@playwright/test';
import { BasePage } from './base.page';

// Interface für Cart Items definieren
interface CartItem {
   name: string;
   price: number;
}

export class CartPage extends BasePage {
   private readonly selectors = {
       checkoutButton: '[data-test="checkout"]',
       continueShoppingButton: '[data-test="continue-shopping"]',
       cartItem: '.cart_item',
       cartList: '.cart_list',
       cartQuantity: '.cart_quantity',
       removeButton: (itemName: string) => `[data-test="remove-${itemName.toLowerCase().replace(/[() ]/g, '-')}"]`,
       itemName: '.inventory_item_name',
       itemPrice: '.inventory_item_price',
       cartBadge: '.shopping_cart_badge'
   };

   constructor(page: Page) {
       super(page);
   }

   // Getter für Selektoren
   getCartListSelector() {
       return this.selectors.cartList;
   }

   // Standard Cart Aktionen
   async proceedToCheckout() {
       await this.page.click(this.selectors.checkoutButton);
   }

   async continueShopping() {
       await this.page.click(this.selectors.continueShoppingButton);
   }

   async removeItem(itemName: string) {
       await this.page.click(this.selectors.removeButton(itemName));
   }

   // Cart Item Management
   async getCartItemCount() {
       return await this.page.locator(this.selectors.cartItem).count();
   }

   async getCartBadgeCount(): Promise<number> {
       const badge = await this.page.locator(this.selectors.cartBadge);
       if (await badge.isVisible()) {
           return parseInt(await badge.textContent() || '0');
       }
       return 0;
   }

   // Cart Validierung
   async isItemInCart(itemName: string): Promise<boolean> {
       const items = await this.page.locator(this.selectors.itemName).allTextContents();
       return items.includes(itemName);
   }

   async getCartTotal(): Promise<number> {
       const priceTexts = await this.page.locator(this.selectors.itemPrice).allTextContents();
       const prices = priceTexts.map(price => parseFloat(price.replace('$', '')));
       return prices.reduce((sum, price) => sum + price, 0);
   }

   // Error Handling Methoden
   async tryProceedToCheckout(): Promise<boolean> {
       try {
           await this.proceedToCheckout();
           await this.page.waitForURL(/.*\/checkout-step-one.html/);
           return true;
       } catch {
           return false;
       }
   }

   async tryRemoveItem(itemName: string): Promise<boolean> {
       try {
           const countBefore = await this.getCartItemCount();
           await this.removeItem(itemName);
           await this.page.waitForTimeout(500);
           const countAfter = await this.getCartItemCount();
           return countAfter < countBefore;
       } catch {
           return false;
       }
   }

   // Cart Items auslesen
   async getAllCartItems(): Promise<CartItem[]> {
       const items = await this.page.locator(this.selectors.cartItem).all();
       const cartItems: CartItem[] = [];
       
       for (const item of items) {
           const name = await item.locator(this.selectors.itemName).textContent() || '';
           const priceText = await item.locator(this.selectors.itemPrice).textContent() || '0';
           const price = parseFloat(priceText.replace('$', ''));
           
           cartItems.push({ name, price });
       }
       
       return cartItems;
   }
}