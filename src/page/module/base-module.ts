
import { Locator, Page, expect } from '@playwright/test';
import { CustomStep } from './custom-step';

export class BaseModule {

    readonly page: Page
    readonly commons: CustomStep

    constructor(page: Page) {
        this.page = page;
        this.commons = new CustomStep(page)
    }
}