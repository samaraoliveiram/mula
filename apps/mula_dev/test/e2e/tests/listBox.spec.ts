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

test.describe("Focusing the listbox", () => {
  test("focuses the first option if none are selected", async ({ page }) => {
    const app = new App(page)
    const option = await app.listBoxPage.elementSelected(COLORS[0]);
    const listbox = await app.listBoxPage.singleSelectTitle;
    test.step('focusing on listbox Black color', async () => {
      await listbox.focus();
    });
    await test.step(`Validate Elelement is focused`, async () => {
      await expect(listbox).toHaveAttribute("aria-activedescendant", await option.evaluate(node => node.id))
      await expect(option).toHaveAttribute("data-focused", "true");
    });
  });

  test("focuses the selected option if there is one", async ({ page }) => {

    const app = new App(page)
    const secondOption = await app.listBoxPage.elementSelected(COLORS[1]);
    const listbox = await app.listBoxPage.singleSelectTitle;
    test.step('Clicking on listbox Blue color', async () => {
      await secondOption.click();
    });
    test.step('Bluring the listbox', async () => {
      await listbox.blur();
    });
    test.step('Focus the listbox', async () => {
      await listbox.focus();
    });
    await test.step(`Validate Elelement is focused`, async () => {
      await expect(listbox).toHaveAttribute("aria-activedescendant", await secondOption.evaluate(node => node.id))
      await expect(secondOption).toHaveAttribute("data-focused", "true");
    });
  });
});

test.describe('Single Component Test', () => {
  test('Select single Component', async ({ page }) => {
    const app = new App(page)
    for (let colors of COLORS) {
      await test.step(`select element ` + colors, async () => {

        await app.listBoxPage.selectSingleElement(colors);
      });
      await test.step(`Validate black is selected`, async () => {
        const expectedColor = await app.listBoxPage.elementSelected(colors);
        const listbox = await app.listBoxPage.singleSelectTitle;
        await expect.soft(expectedColor).toHaveAttribute("aria-selected", "true")
        await expect.soft(expectedColor).toHaveAttribute("data-focused", "true");
        await expect(listbox).toHaveAttribute("aria-activedescendant", await expectedColor.evaluate(node => node.id))

      });
    }
  })
});



test.describe("Keyboard", () => {
  test("Space toggles the focused option selection", async ({ page }) => {

    const app = new App(page)
    const option = await app.listBoxPage.elementSelected(COLORS[0]);
    const listbox = await app.listBoxPage.singleSelectTitle;
    await test.step(`focus on listbox `, async () => {
      listbox.focus();
    })
    await test.step(`Assert the focus by vaidation element is not selected `, async () => {
      await expect.soft(option).toHaveAttribute("aria-selected", "false");
    })
    await test.step(`Keypress "space" action `, async () => {
      listbox.press("Space");
    })
    await test.step(`Assert the selection by keypress space `, async () => {
      await expect.soft(option).toHaveAttribute("aria-selected", "true");
    })
    await test.step(`Keypress "space" action again to defocus `, async () => {
      listbox.press("Space");
    })
    await test.step(`Validating defocus `, async () => {
      await expect.soft(option).toHaveAttribute("aria-selected", "false");
    })
  });

  test("arrows move options focus up and down", async ({ page }) => {

    const app = new App(page)
    const listbox = await app.listBoxPage.singleSelectTitle;
    await test.step(`Focus on element ${COLORS[0]} and assert if focused`, async () => {
      await listbox.focus();
      await assertOptionFocused(
        listbox,
        await app.listBoxPage.elementSelected(COLORS[0])
      );
    })
    await test.step(`Keypress down arrow and validate ${COLORS[1]} is focused`, async () => {
      await listbox.press("ArrowDown");
      await assertOptionFocused(
        listbox,
        await app.listBoxPage.elementSelected(COLORS[1])
      );
    })
    await test.step(`Keypress down arrow and validate ${COLORS[2]} is focused`, async () => {
      await listbox.press("ArrowDown");
      await assertOptionFocused(
        listbox,
        await app.listBoxPage.elementSelected(COLORS[2])
      );
    })

    // Idempotent when is the last option
    await test.step(`Idempotent when is the last option: ${COLORS[2]}`, async () => {
      await listbox.press("ArrowDown");
      await assertOptionFocused(
        listbox,
        await app.listBoxPage.elementSelected(COLORS[2])
      );
    })
    await test.step(`Keypress up arrow and validate ${COLORS[1]} is focused`, async () => {
      await listbox.press("ArrowUp");
      await assertOptionFocused(
        listbox,
        await app.listBoxPage.elementSelected(COLORS[1])
      );
    })
    await test.step(`Keypress up arrow and validate ${COLORS[0]} is focused`, async () => {
      await listbox.press("ArrowUp");
      await assertOptionFocused(
        listbox,
        await app.listBoxPage.elementSelected(COLORS[0])
      );
    })

    // Idempotent when is the fist option
    await test.step(`Idempotent when is the fist option: ${COLORS[0]} `, async () => {
      await listbox.press("ArrowUp");
      await assertOptionFocused(
        listbox,
        await app.listBoxPage.elementSelected(COLORS[0])
      );
    });
  })

  test("Home and End navigate to top and bottom of the options", async ({
    page,
  }) => {
    const app = new App(page)
    const option = await app.listBoxPage.elementSelected(COLORS[0]);
    const listbox = await app.listBoxPage.singleSelectTitle
    await test.step(`Keypress to End and validate ${COLORS[2]} is focused `, async () => {
      await listbox.press("End");
      await assertOptionFocused(
        listbox,
        await app.listBoxPage.elementSelected(COLORS[2])
      );
    })
    await test.step(`Keypress to Home and validate ${COLORS[0]} is focused `, async () => {
      await listbox.press("Home");
      await assertOptionFocused(
        listbox,
        await app.listBoxPage.elementSelected(COLORS[0])
      );
    });
  })
});

async function assertOptionFocused(listbox, option, state = true) {
  if (state == true) {
    const option_id = await option.evaluate((node) => node.id);
    await expect(listbox).toHaveAttribute("aria-activedescendant", option_id);
  } else {
    await expect(listbox).toHaveAttribute("aria-activedescendant", "");
  }

  await expect(option).toHaveAttribute("data-focused", state.toString());
}



