import { test, expect } from '@playwright/test'
import { App } from '../pages/app'
const { syncLV } = require("../pages/utilities/utils");
const COLORS = ["Black", "Blue", "Red"]

test.beforeEach(async ({ page }, testInfo) => {
  console.log(`Running ${testInfo.title}`);
  const app = new App(page);
  await test.step(`Logged in and launched mula`, async () => {
    await app.homePage.open()
  });
  await test.step(`Navigate to listbox`, async () => {
    await app.navigate.goToListBoxes();
    await syncLV(page);
  });


});

test.describe('Single Component Test', () => {
  test('Select single Component', async ({ page }) => {
    const app = new App(page)
    console.log('before selecting');
    await test.step(`select element Black`, async () => {

      await app.listBoxPage.selectSingleElement('Black');
      console.log('After selecting');
    });
    await test.step(`Validate 1 is selected`, async () => {
      console.log('validation');
      const expectedColor = await app.listBoxPage.elementSelected('Black');
      const listbox = await app.listBoxPage.singleSelectTitle;
      console.log(expectedColor)
      await expect.soft(expectedColor).toHaveAttribute("aria-selected", "true")
      await expect.soft(expectedColor).toHaveAttribute("data-focused", "true");


    });

  })
});


