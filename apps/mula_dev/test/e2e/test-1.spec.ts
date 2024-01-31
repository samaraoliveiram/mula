import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://mula.fly.dev/listbox');
  await page.getByLabel('Favorite color', { exact: true }).getByText('Black').click();
  await page.getByLabel('Favorite color', { exact: true }).getByText('Blue').click();
  await page.getByLabel('Favorite colors').getByText('Black').click();
  await page.getByLabel('Favorite colors').getByText('Blue').click();
  await page.getByLabel('Favorite colors').getByText('Red').click();
  await page.getByLabel('Favorite colors').getByRole('option', { name: 'Blue' }).click();
});