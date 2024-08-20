const { describe, test, expect } = require("@playwright/test");
const { syncLV } = require("./utils");

const COLORS = ["Black", "Blue", "Red"]

test.beforeEach(async ({ page }) => {
  await page.goto("/listbox")
  await syncLV(page)
})

describe("Multiple selection with modifier keys", () => {
  test("selects elements between focused option and last selected option", async ({ page }) => {
    const listbox = await getListbox(page)

    await listbox.focus()

    await page.keyboard.press("Space")
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Shift+Space")

    let selectedOptions = await listbox.getByRole("option", { selected: true })

    await expect(selectedOptions).toHaveCount(3)

    await page.keyboard.press("ArrowUp")
    await page.keyboard.press("ArrowUp")
    await page.keyboard.press("Shift+Space")

    selectedOptions = await listbox.getByRole("option", { selected: true })

    await expect(selectedOptions).toHaveCount(0)
  })
})

describe("Focusing the listbox", () => {
  test("focuses the first option if none are selected", async ({ page }) => {
    const listbox = page.getByRole("listbox", { name: "Favorite color", exact: true })
    const option = listbox.getByRole("option", { name: "Black" })

    await listbox.focus()

    await expect(listbox).toHaveAttribute("aria-activedescendant", option.evaluate(node => node.id))
    await expect(option).toHaveAttribute("data-focused", "true")
  })

  test("focuses the selected option if there is one", async ({ page }) => {
    const listbox = page.getByRole("listbox", { name: "Favorite color", exact: true })
    const secondOption = listbox.getByRole("option", { name: "Blue" })
    await secondOption.click()
    await listbox.blur()

    await listbox.focus()

    await expect(listbox).toHaveAttribute("aria-activedescendant", secondOption.evaluate(node => node.id))
    await expect(secondOption).toHaveAttribute("data-focused", "true")
  })
})

describe("Clicking an option", () => {
  test("selects and focuses it", async ({ page }) => {
    const listbox = page.getByRole("listbox", { name: "Favorite color", exact: true })

    for (let number of COLORS) {
      const option = listbox.getByRole("option", { name: number })
      await option.click()

      await expect.soft(option).toHaveAttribute("aria-selected", "true")
      await expect.soft(option).toHaveAttribute("data-focused", "true")
      await expect.soft(listbox).toHaveAttribute("aria-activedescendant", option.evaluate(node => node.id))
    }
  })
})

describe("Keyboard", () => {
  test("Space toggles the focused option selection", async ({ page }) => {
    const listbox = page.getByRole("listbox", { name: "Favorite color", exact: true })
    const option = listbox.getByRole("option", { name: "Black" })

    listbox.focus()
    await expect.soft(option).toHaveAttribute("aria-selected", "false")

    listbox.press("Space")
    await expect.soft(option).toHaveAttribute("aria-selected", "true")

    listbox.press("Space")
    await expect.soft(option).toHaveAttribute("aria-selected", "false")
  })


  test("arrows move options focus up and down", async ({ page }) => {
    const listbox = page.getByRole("listbox", { name: "Favorite color", exact: true })

    await listbox.focus()
    await assertOptionFocused(listbox, listbox.getByRole("option", { name: "Black" }))

    await listbox.press("ArrowDown")
    await assertOptionFocused(listbox, listbox.getByRole("option", { name: "Blue" }))

    await listbox.press("ArrowDown")
    await assertOptionFocused(listbox, listbox.getByRole("option", { name: "Red" }))

    await listbox.press("ArrowDown")
    await assertOptionFocused(listbox, listbox.getByRole("option", { name: "White" }))

    // Idempotent when is the last option
    await listbox.press("ArrowDown")
    await assertOptionFocused(listbox, listbox.getByRole("option", { name: "White" }))

    await listbox.press("ArrowUp")
    await assertOptionFocused(listbox, listbox.getByRole("option", { name: "Red" }))

    await listbox.press("ArrowUp")
    await assertOptionFocused(listbox, listbox.getByRole("option", { name: "Blue" }))

    await listbox.press("ArrowUp")
    await assertOptionFocused(listbox, listbox.getByRole("option", { name: "Black" }))

    // Idempotent when is the fist option
    await listbox.press("ArrowUp")
    await assertOptionFocused(listbox, listbox.getByRole("option", { name: "Black" }))
  })

  test("Home and End navigate to top and bottom of the options", async ({ page }) => {
    const listbox = page.getByRole("listbox", { name: "Favorite color", exact: true })

    await listbox.press("End")
    await assertOptionFocused(listbox, listbox.getByRole("option", { name: "White" }))

    await listbox.press("Home")
    await assertOptionFocused(listbox, listbox.getByRole("option", { name: "Black" }))
  })
})

function getListbox(page) {
  return page.getByRole("listbox", { name: "Favorite colors", exact: true })
}

async function assertOptionFocused(listbox, option, state = true) {
  if (state == true) {
    const option_id = option.evaluate(node => node.id)
    await expect(listbox).toHaveAttribute("aria-activedescendant", option_id)
  } else {
    await expect(listbox).toHaveAttribute("aria-activedescendant", "")
  }

  await expect(option).toHaveAttribute("data-focused", state.toString())
}
