import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  await page.locator('[data-test="login-credentials"]').click();
  await page1.goto('https://www.saucedemo.com/');
  await page1.locator('[data-test="username"]').click();
  await page1.locator('[data-test="username"]').press('ControlOrMeta+V');
  await page1.locator('[data-test="login-password"]').click();
  await page1.locator('[data-test="password"]').click();
  await page1.locator('[data-test="password"]').fill('SECRET_SAUCE');
  await page1.locator('[data-test="password"]').press('Enter');
  await page1.locator('[data-test="login-button"]').click();
  await page1.locator('path').nth(1).click();
  await page1.locator('[data-test="password"]').fill('');
  await page1.locator('[data-test="password"]').press('CapsLock');
  await page1.locator('[data-test="password"]').fill('secret_sauce');
  await page1.locator('[data-test="password"]').press('Enter');
  await page1.locator('[data-test="login-button"]').click();
  await page1.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page1.locator('[data-test="remove-sauce-labs-backpack"]').click();
  await page1.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
  await page1.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
  page1.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page1.locator('[data-test="product-sort-container"]').selectOption('za');
  await page1.locator('[data-test="product-sort-container"]').click();
  await page1.locator('[data-test="shopping-cart-link"]').click();
  await page1.locator('[data-test="checkout"]').click();
  await page1.locator('[data-test="firstName"]').click();
  await page1.locator('[data-test="firstName"]').fill('test');
  await page1.locator('[data-test="lastName"]').click();
  await page1.locator('[data-test="lastName"]').fill('t');
  await page1.locator('[data-test="postalCode"]').click();
  await page1.locator('[data-test="postalCode"]').fill('12358');
  await page1.locator('[data-test="continue"]').click();
  await page1.locator('[data-test="finish"]').click();
  page1.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page1.locator('[data-test="product-sort-container"]').selectOption('za');
  page1.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page1.locator('[data-test="product-sort-container"]').selectOption('za');
});