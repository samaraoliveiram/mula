import { Page } from '@playwright/test'
import { BasePage } from '../base.page'
import LocatorActions from '../utilities/locatorActions'

export class NavigationComponent extends BasePage {
  constructor(page: Page) {
    super(page)
  }

  async goToListBoxes() {
    const actions = new LocatorActions(this.page);
    await actions.clickOnObjectByRole('link', 'listbox');
  }

}
