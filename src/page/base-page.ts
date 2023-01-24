
import { Page, Locator, expect } from '@playwright/test';
import { CustomStep } from './module/custom-step';

export class BasePage {

    readonly page: Page;
    readonly commons: CustomStep

    constructor(page: Page) {
        this.page = page;
        this.commons = new CustomStep(page)
    }

    async refresh() {
        this.page.reload({ waitUntil: 'networkidle' })
    }

}