import { PlaywrightTestConfig, devices } from '@playwright/test'

import { expect } from "@playwright/test"
import { matchers } from "expect-playwright"
import { FixtureOptions } from "./src/fixture/test-data-types"
import dotenv from 'dotenv'

dotenv.config()

expect.extend(matchers)

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig<FixtureOptions> = {

  /* Ability to automatically build the application befor the tests */
  // webServer: {
  //   command: 'npm run serve',
  //   url: `http://${process.env.HOST}:${process.env.UI_PORT}`,
  //   timeout: 60 * 1000
  // },

  testDir: './src/spec',
  timeout: 120 * 1000,

  expect: {
    timeout: 5 * 1000
  },

  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 5 : 1,
  reporter: [
    ['line'],
    ['json', { outputFile: './build/test-results/results.json' }],
    ['./src/util/test-start-stop-reporter.ts'],
    ['allure-playwright'],
    ['html', { open: 'on-failure' }]
  ],


  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: `http://${process.env.HOST}:${process.env.UI_PORT}`,
    screenshot: 'only-on-failure',
    video: {
      mode: 'retain-on-failure',
      size: { width: 1920, height: 1080 }, 
    },

    headless: false,
    
    ignoreHTTPSErrors: true,

    actionTimeout: 5 * 1000,
    navigationTimeout: 30 * 1000
  },

  projects: [
    {
      name: 'As a guest in Desktop Chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: {
          width: 1920,
          height: 1080
        },

        userRole: 'guest', // the role to use in fixtures and tests within this project, see resource/users.json

        launchOptions: {
          args: [`--window-position=${process.env.BROWSER_X_POSITION},${process.env.BROWSER_Y_POSITION}`],
          devtools: !!process.env.PWDEBUG,
          slowMo: 50 
        },
        contextOptions: {
          permissions: ['clipboard-read', 'clipboard-write']
        }    
      }
    }
  ],
  outputDir: 'build/test-results/'
};
export default config;
