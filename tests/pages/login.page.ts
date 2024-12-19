// tests/pages/login.page.ts
import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
   // Private Selektoren
   private readonly selectors = {
       usernameInput: '#user-name',
       passwordInput: '#password',
       loginButton: '#login-button',
       errorMessage: '[data-test="error"]'
   };

   constructor(page: Page) {
       super(page);
   }

   // Getter für Selektoren (für Tests)
   getErrorMessageSelector() {
       return this.selectors.errorMessage;
   }

   // Standard Login
   async login(username: string, password: string) {
       await this.page.fill(this.selectors.usernameInput, username);
       await this.page.fill(this.selectors.passwordInput, password);
       await this.page.click(this.selectors.loginButton);
   }

   // Login mit Performance-Messung
   async loginWithTiming(username: string, password: string): Promise<number> {
       return await this.measureActionTime(
           async () => {
               await this.login(username, password);
           },
           '.inventory_list' // Warte auf die Inventory Liste
       );
   }

   // Login mit detaillierten Performance-Metriken
   async loginWithDetailedTiming(username: string, password: string) {
       const timings = {
           formFill: 0,
           buttonClick: 0,
           navigationComplete: 0,
           totalTime: 0
       };

       const startTime = Date.now();

       // Zeit für Form-Ausfüllung messen
       timings.formFill = await this.measureLoadTime(async () => {
           await this.page.fill(this.selectors.usernameInput, username);
           await this.page.fill(this.selectors.passwordInput, password);
       });

       // Zeit für Button-Click messen
       timings.buttonClick = await this.measureLoadTime(async () => {
           await this.page.click(this.selectors.loginButton);
       });

       // Zeit bis Navigation abgeschlossen
       timings.navigationComplete = await this.waitForElementWithTiming('.inventory_list');

       // Warte auf Network Idle für vollständiges Laden
       await this.waitForNetworkIdle();

       timings.totalTime = Date.now() - startTime;

       return timings;
   }

   // Performance Metriken für die Login-Seite
   async getLoginPageMetrics() {
       return await this.getPerformanceMetrics();
   }

   // Methode zum Prüfen, ob wir auf der Login-Seite sind
   async isOnLoginPage() {
       return await this.page.isVisible(this.selectors.loginButton);
   }

   // Methode zum Prüfen der Fehlermeldung
   async getErrorMessage() {
       const errorElement = await this.page.locator(this.selectors.errorMessage);
       if (await errorElement.isVisible()) {
           return await errorElement.textContent();
       }
       return null;
   }

   // Hilfsmethode für Performance-Tests
   async waitForLoginComplete() {
       await this.waitForNetworkIdle();
       await this.page.waitForSelector('.inventory_list', { state: 'visible' });
   }
}