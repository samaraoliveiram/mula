import type { PlaywrightTestConfig } from '@playwright/test'
import { devices } from '@playwright/test'
import { resolve } from 'path'

const environmentVar = process.env.TEST_ENVIRONMENT === undefined ? '' : process.env.TEST_ENVIRONMENT
const { urls } = require(`../constants/urls`);

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: resolve(__dirname, `../test/e2e/tests`),
  globalTeardown: require.resolve('../../../global-teardown'),
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 5000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list', {
      outputFolder: resolve(__dirname, `test-results/list`),
    }],
    [
      'allure-playwright',
      {
        detail: true,
        outputFolder: resolve(__dirname, `test-results/allure`),
        suiteTitle: false,
      },
    ],
    [
      'junit',
      {
        open: process.env.CI ? 'never' : 'on-failure',
        outputFolder: resolve(__dirname, `test-results/junit`),
      },
    ],
    [
      'html',
      {
        open: process.env.CI ? 'never' : 'on-failure',
        outputFolder: resolve(__dirname, `test-results/html`),
      },
    ],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    screenshot: 'only-on-failure',
    baseURL: urls[environmentVar].website,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'off',
    video: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chrome',
      use: {
        headless: process.env.CI ? true : false,
        ...devices['Desktop Chrome'],
      },
    },
    /*
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },
    */

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: {
    //     ...devices['Pixel 5'],
    //   },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: {
    //     ...devices['iPhone 12'],
    //   },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: {
    //     channel: 'msedge',
    //   },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: {
    //     channel: 'chrome',
    //   },
    // },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  // outputDir: 'test-results/',

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  // },
}

export default config
