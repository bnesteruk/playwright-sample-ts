
import { Locator, Page, expect } from '@playwright/test';

export class CustomStep {

    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async sleep(milliSeconds: number) {
        new Promise(f => setTimeout(f, milliSeconds));
    }

    async clearInput(input: Locator) {
        await expect(input).toBeVisible();
        await input.click({ clickCount: 3 })
        await this.page.keyboard.press('Backspace')
    }

    async waitForElementIgnoring(element: Locator, timeout?: number): Promise<boolean> {
        try {
            await expect(element.first()).toBeVisible({ timeout: timeout })
            return true
        } catch (ignore) {
            return false
        }
    }

    /* A way to handle exceptions like 'Stale Element Reference | Element not attached to DOM' without implicit waitings */
    async repeatWhileError(action: Function, timeout: number = 10 * 1000) {
        const start = performance.now();
        while (timeout - (performance.now() - start) > 0) {
            try {
                await action()
                return
            } catch (ex) {
                console.log(ex)
            }
        }
        throw new Error(`Failed to execute ${action} within ${timeout} timeout`)
    }

    async scrollElementToTop(element: Locator) {
        await element.evaluate((element) => {
            function getScrollParent(node) {
                if (node == null) {
                    return null;
                }
                if (node.scrollHeight > node.clientHeight) {
                    return node;
                } else {
                    return getScrollParent(node.parentNode);
                }
            }
            getScrollParent(element)?.scrollTo(0, 0)
        });
    }
}