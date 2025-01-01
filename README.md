# Playwright Test Suite for Saucedemo

## Projektübersicht

Dieses Repository enthält eine Playwright-basierte Test-Suite zur Überprüfung der Funktionalitäten der Website [Saucedemo](https://www.saucedemo.com). Die Tests decken verschiedene Benutzerrollen und Szenarien ab, einschließlich der Validierung von Fehlerfällen, Performance-Problemen und UI-Glitches. Das Ziel ist es, sicherzustellen, dass die Website robust, benutzerfreundlich und fehlerfrei ist.

---

## Inhalte
- [Projektübersicht](#projekt%C3%BCbersicht)
- [Features](#features)
- [Installation](#installation)
- [Nutzung](#nutzung)
- [Teststruktur](#teststruktur)
- [Benutzerrollen](#benutzerrollen)
- [Teststrategie](#teststrategie)
- [Technologien](#technologien)
- [Lizenz](#lizenz)

---

## Features
- Automatisierte Tests mit [Playwright](https://playwright.dev).
- Abdeckung verschiedener Benutzertypen:
  - Standard User
  - Locked Out User
  - Problem User
  - Performance Glitch User
  - Error User
  - Visual User
- Tests für die wichtigsten Anwendungsfälle:
  - Login
  - Warenkorb
  - Checkout
  - Produktseite
  - Sortier- und Filterfunktionen
- Unterstützung von mehreren Browsern (Chrome, Firefox, Safari).
- Parallelisierte Testausführung.

---

## Installation
1. Klone das Repository:
   ```bash
   git clone https://github.com/username/saucedemo-playwright-tests.git
   ```

2. Wechsle in das Verzeichnis:
   ```bash
   cd saucedemo-playwright-tests
   ```

3. Installiere die Abhängigkeiten:
   ```bash
   npm install
   ```

4. Konfiguriere die Umgebungsvariablen:
   Erstelle eine `.env`-Datei basierend auf `.env.example` und füge deine Zugangsdaten hinzu:
   ```env
   STANDARD_USER=standard_user
   LOCKED_OUT_USER=locked_out_user
   PROBLEM_USER=problem_user
   PERFORMANCE_GLITCH_USER=performance_glitch_user
   ERROR_USER=error_user
   VISUAL_USER=visual_user
   SAUCE_PASSWORD=secret_sauce
   ```

---

## Nutzung
1. Führe die Tests aus:
   ```bash
   npx playwright test
   ```

2. Ergebnisse als HTML-Report:
   ```bash
   npx playwright show-report
   ```

3. Einzelnen Test oder Testdatei ausführen:
   ```bash
   npx playwright test tests/specs/standard-user/login.spec.ts
   ```

4. Tests mit einem bestimmten Browser ausführen:
   ```bash
   npx playwright test --project=Chrome
   ```

---

## Teststruktur
Die Test-Suite ist nach Benutzerrollen und Anwendungsfällen organisiert:

```
.
├── tests/
│   ├── pages/          # Page Object Model (Seitenklassen)
│   ├── specs/          # Testfälle
│   │   ├── standard-user/         # Tests für Standard User
│   │   ├── problem-user/          # Tests für Problem User
│   │   ├── performance-user/      # Tests für Performance Glitch User
│   │   ├── error-user/            # Tests für Error User
│   │   └── visual-user/          # Tests für Visual User
│   ├── data/           # Testdaten
│   └── utils/          # Hilfsfunktionen
├── .env.example        # Beispiel für Umgebungsvariablen
├── playwright.config.ts # Playwright Konfiguration
├── package.json        # Node.js Konfigurationsdatei
└── README.md           # Dokumentation
```

---

## Benutzerrollen
1. **Standard User:**
   - Grundlegende Tests der Funktionalität ("Happy Path").
2. **Locked Out User:**
   - Fehlerfälle beim Login.
3. **Problem User:**
   - Simulation von UI-Bugs und fehlerhaften Interaktionen.
4. **Performance Glitch User:**
   - Tests für langsame Ladezeiten und Performanceprobleme.
5. **Error User:**
   - Validierung der Fehlerbehandlung in verschiedenen Szenarien.
6. **Visual User:**
   - Tests auf visuelle Inkonsistenzen und Layoutprobleme.
   - Sicherstellung der visuellen Konsistenz zwischen verschiedenen Browsern.

---

## Teststrategie
1. **Smoke Tests:**
   - Login-Funktionalität
   - Grundlegende Warenkorb-Operationen
   - Checkout-Prozess
2. **Regression Tests:**
   - Produktsortierung
   - Warenkorb-Management
   - Formularvalidierung
3. **Negative Tests:**
   - Fehlerhafte Logins
   - Ungültige Formulareingaben
   - Netzwerkfehler
4. **UI/UX Tests:**
   - Layout-Konsistenz
   - Button-Funktionalität
   - Bildanzeige
5. **Performance Tests:**
   - Seitenlade-Zeiten
   - Reaktionszeiten
   - Netzwerk-Metriken

## CI/CD Integration
- Automatisierte Testausführung bei Pull Requests
- Parallele Testausführung mit Sharding
- HTML-Testreports
- Artefakt-Speicherung für Fehleranalyse

---

## Technologien
- **[Playwright](https://playwright.dev):** End-to-End Testing.
- **Node.js:** JavaScript-Laufzeitumgebung.
- **TypeScript:** Statische Typisierung.



