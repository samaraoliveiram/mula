import { Page } from '@playwright/test'
import { BasePage } from '../base.page.ts'
export default class LocatorActions extends BasePage {
    constructor(page: Page) {
        super(page)
    }
    async clickOnObjectByRole(roleType: any, name: any) {
        await this.page.getByRole(roleType, { name: name }).click();
    }
    async clickOnObjectByText(roleType: any, name: any) {
        await this.page.getByRole(roleType, { name: name }).click();
    }
}
