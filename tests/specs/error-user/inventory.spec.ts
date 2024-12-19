import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';

test.describe('Error User Tests - Inventory Page', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    // Initialisiere die Seitenobjekte
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    // Logge als 'error_user' ein
    await page.goto('/');
    await loginPage.login(process.env.ERROR_USER || '', process.env.SAUCE_PASSWORD || '');
    await expect(page.locator(inventoryPage.getProductListSelector())).toBeVisible();
  });

  test('sorting functionality shows error popup', async ({ page }) => {
    try {
      // JavaScript-Dialog behandeln
      const dialogPromise = page.waitForEvent('dialog');
      await page.locator('[data-test="product-sort-container"]').selectOption('za');
  
      const dialog = await dialogPromise;
      console.log(`Dialog message: ${dialog.message()}`);
      await dialog.dismiss();
    } catch (e) {
      console.warn('Kein Dialog erkannt, prüfe UI-Fehlermeldung...');
      
      // UI-Fehlermeldung prüfen
      const popup = page.locator('.error-message-container');
      await popup.waitFor({ state: 'visible', timeout: 10000 }); // Explizites Warten
      await expect(popup).toContainText('Sorting is not available');
    }
  });

  test('add-to-cart works only for specific products', async ({ page }) => {
    const products = [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Onesie',
      'Test.allTheThings() T-Shirt (Red)',
    ];
  
    const failingProducts: string[] = [];
    const successfulProducts: string[] = [];
  
    // Versuche, jedes Produkt zum Warenkorb hinzuzufügen
    for (const product of products) {
      console.log(`Prüfe Add-to-Cart für: ${product}`);
      const addToCartButton = `[data-test="add-to-cart-${product.toLowerCase().replace(/ /g, '-').replace(/\(|\)/g, '')}"]`;
  
      try {
        const button = page.locator(addToCartButton);
  
        // Prüfe, ob der Button sichtbar ist und klicke ihn
        if (await button.isVisible()) {
          await button.click();
  
          // Warenkorb prüfen
          const cartCount = await inventoryPage.getCartItemCount();
          if (cartCount > 0) {
            successfulProducts.push(product);
            console.log(`✅ Produkt erfolgreich hinzugefügt: ${product}`);
          } else {
            failingProducts.push(product);
            console.warn(`❌ Produkt konnte nicht hinzugefügt werden: ${product}`);
          }
        } else {
          failingProducts.push(product);
          console.warn(`❌ Button nicht sichtbar für: ${product}`);
        }
  
        // Warenkorb zurücksetzen für den nächsten Test
        await inventoryPage.removeProductFromCart(product).catch(() => {});
      } catch (error) {
        failingProducts.push(product);
        console.error(`❌ Fehler beim Hinzufügen von ${product}: ${error.message}`);
      }
    }
  
    // Prüfe die Ergebnisse
    console.log('✅ Erfolgreich hinzugefügte Produkte:', successfulProducts);
    console.warn('❌ Fehlerhafte Produkte:', failingProducts);
  
    // Assertions: Stelle sicher, dass bestimmte Produkte fehlschlagen
    expect(failingProducts.length).toBe(3);
    expect(successfulProducts.length).toBe(3);
  });
  
  test('remove button does not work for certain products', async ({ page }) => {
    await inventoryPage.addProductToCart('Sauce Labs Backpack');
    await inventoryPage.removeProductFromCart('Sauce Labs Backpack');
    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(1); // Produkt bleibt im Warenkorb
  });
});
