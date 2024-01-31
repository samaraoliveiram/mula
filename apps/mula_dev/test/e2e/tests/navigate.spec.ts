import { test, expect } from '@playwright/test'
import { App } from '../pages/app'

test.beforeEach(async ({ page }, testInfo) => {
  console.log(`Running ${testInfo.title}`);
  const app = new App(page);
  await test.step(`Logged in and launched mula`, async () => {
    await app.homePage.open()
  });
});

test.describe('Navigate to pages', () => {
  test('Navigate to ListBox Page', async ({ page }) => {
    const app = new App(page)

    await test.step(`Navigate to listbox`, async () => {
      await app.navigate.goToListBoxes();
    });
    await test.step(`Validate the single title header exists`, async () => {
      await expect(app.listBoxPage.singleSelectTitle).toBeVisible();
    });
    await test.step(`Validate the multiple title header exists`, async () => {
      await expect(app.listBoxPage.multipleSelectTitle).toBeVisible();
    });

  })

});


