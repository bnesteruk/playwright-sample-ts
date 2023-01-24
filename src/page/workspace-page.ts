
import { Page } from '@playwright/test';
import { BasePage } from './base-page';

export class WorkSpacePage extends BasePage {

    constructor(page: Page) {
        super(page)
    }

    async getClipboardContent() {
        return await this.page.evaluate(() => navigator.clipboard.readText())
    }

}