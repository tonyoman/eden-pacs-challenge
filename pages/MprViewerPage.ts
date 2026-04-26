import { Page, Locator } from '@playwright/test';


export class MprViewerPage {
  readonly page: Page;
  readonly circularMenu: Locator;
  readonly zoomButton: Locator;
  readonly restoreButton: Locator;
  readonly predefinedLevelsButton: Locator;


  constructor(page: Page) {
    this.page = page;
    this.circularMenu = page.locator('#circular-menu');
    this.zoomButton = page.getByRole('tab', { name: 'Zoom' });
    this.restoreButton = page.getByRole('tab', { name: 'Restore' });
    this.predefinedLevelsButton = page.locator('button:has-text("Predefined levels")');
    
    
  }

  // Navigate to the viewer and wait for initial DOM load
  async goto(url: string) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async waitForViewerReady() {
    await this.page.waitForSelector('canvas', { timeout: 30000 });
  }

  async openCircularMenu() {
    const canvas = this.page.locator('canvas').first();
    await canvas.click({ button: 'right' });
    await this.circularMenu.waitFor({ state: 'visible' });
  }

  async selectZoomFromCircularMenu() {
  await this.openCircularMenu();
  const zoomItem = this.page.locator('#circular-menu li:nth-child(5) a');
  await zoomItem.hover();
  // Wait until data-content confirms we're hovering Zoom before clicking
  await this.page.waitForFunction(() => {
    return document.querySelector('#circular-menu')
      ?.getAttribute('data-content') === 'Zoom';
  });
  await zoomItem.click();
}

async selectPredefinedLevel(levelName: string) {
  await this.predefinedLevelsButton.click();
  await this.page.getByRole('menuitem', { name: levelName }).click();
}



  // Clicking outside the menu closes it
  async closeCircularMenu() {
    await this.page.mouse.click(10, 10);

  }
}
  