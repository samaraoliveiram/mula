import { Page } from '@playwright/test'
import { NavigationComponent } from './components/navigation.component'
import { ListBoxPage } from './listbox.page'
import { HomePage } from './homePage.page'


export class App {
  private readonly _listBoxPage: ListBoxPage
  private readonly _navigate: NavigationComponent
  private readonly _homepage: HomePage

  constructor(page: Page) {
    this._listBoxPage = new ListBoxPage(page)
    this._navigate = new NavigationComponent(page)
    this._homepage = new HomePage(page)
  }

  public get listBoxPage(): ListBoxPage {
    return this._listBoxPage
  }

  public get navigate(): NavigationComponent {
    return this._navigate
  }

  public get homePage(): HomePage {
    return this._homepage
  }
}
