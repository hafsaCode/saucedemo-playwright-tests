import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import 'dotenv/config';

// Test-Daten Management - nur über Umgebungsvariablen
const testData = {
  standardUser: {
    username: process.env.STANDARD_USER,
    password: process.env.SAUCE_PASSWORD,
    description: 'Happy path testing'
  },
  lockedUser: {
    username: process.env.LOCKED_OUT_USER,
    password: process.env.SAUCE_PASSWORD,
    description: 'Error handling and authentication testing'
  },
  problemUser: {
    username: process.env.PROBLEM_USER,
    password: process.env.SAUCE_PASSWORD,
    description: 'UI inconsistency testing'
  },
  performanceGlitchUser: {
    username: process.env.PERFORMANCE_GLITCH_USER,
    password: process.env.SAUCE_PASSWORD,
    description: 'Performance and timeout testing'
  },
  errorUser: {
    username: process.env.ERROR_USER,
    password: process.env.SAUCE_PASSWORD,
    description: 'Application error handling testing'
  },
  visualUser: {
    username: process.env.VISUAL_USER,
    password: process.env.SAUCE_PASSWORD,
    description: 'Visual and layout testing'
  }
};

// Validierung der erforderlichen Umgebungsvariablen
if (!process.env.SAUCE_PASSWORD) {
  throw new Error('SAUCE_PASSWORD environment variable is required');
}

export default defineConfig({
  // Basis Test-Konfiguration
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  
  // Test Ausführungskonfiguration mit Sharding
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  // Sharding Konfiguration
  shard: process.env.CI ? {
    current: Number(process.env.SHARD_NUMBER) || 1,
    total: Number(process.env.TOTAL_SHARDS) || 4
  } : undefined,

  // Reporting Setup mit Sharding-spezifischen Ausgabeverzeichnissen
  reporter: [
    ['html', {
      outputFolder: path.join('test-results', `html-report${process.env.SHARD_NUMBER ? '-shard-' + process.env.SHARD_NUMBER : ''}`),
      open: process.env.CI ? 'never' : 'on-failure',
      attachments: true
    }],
    ['json', {  
      outputFile: path.join('test-results', 'json-report', `results${process.env.SHARD_NUMBER ? '-shard-' + process.env.SHARD_NUMBER : ''}.json`)
    }],
    ['list', {  
      printSteps: true
    }]
  ],

  use: {
    baseURL: 'https://www.saucedemo.com',
    viewport: { width: 1280, height: 720 },
    navigationTimeout: process.env.PERFORMANCE_TEST ? 30000 : 15000,
    actionTimeout: process.env.PERFORMANCE_TEST ? 20000 : 10000,
    trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true
  },

  projects: [
    {
      name: 'Chrome',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'Safari',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] }
    }
  ],

  outputDir: path.join('test-results', `test-artifacts${process.env.SHARD_NUMBER ? '-shard-' + process.env.SHARD_NUMBER : ''}`)
});