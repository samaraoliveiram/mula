import { Page } from '@playwright/test'

export class BasePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async open() {
    await this.page.goto('https://mula.fly.dev/')
  }
}
