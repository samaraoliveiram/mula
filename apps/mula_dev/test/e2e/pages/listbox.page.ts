import { Page } from '@playwright/test'
import { BasePage } from './base.page'
import LocatorActions from './utilities/locatorActions'


export class ListBoxPage extends BasePage {
  constructor(page: Page) {
    super(page)
  }

  get singleSelectTitle() {
    return this.page.getByRole("listbox", { name: "Favorite color", exact: true })
  }

  get multipleSelectTitle() {
    return this.page.getByRole("listbox", { name: "Favorite colors", exact: true })
  }


  async elementSelected(name: any) {
    return this.singleSelectTitle.getByRole('option', { name: name })
  }

  async selectSingleElement(name: any) {

    await this.singleSelectTitle.getByRole('option', { name: name }).click();
    console.log("clicked on " + name);

  }


}
