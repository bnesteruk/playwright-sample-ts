import { CanvasExamplePage } from '@/page/canvas-page';
import { test as base } from '@playwright/test';
import { CalendarExamplePage } from '../page/calendar-page';

type Pages = {
    calendarPage: CalendarExamplePage
    canvasPage: CanvasExamplePage
};

export const test = base.extend<Pages>({
    page: async ({ baseURL, page }, use) => {
        await page.goto(baseURL);
        await use(page);
    },

    calendarPage: async ({ page }, use) => {
        const calendarExamplePage = new CalendarExamplePage(page)
        await use(calendarExamplePage)
    }, 

    canvasPage: async ({ page }, use) => {
        const canvasPage = new CanvasExamplePage(page)
        await use(canvasPage)
    }
});
