import { test as base } from '@playwright/test';
import { CalendarExamplePage } from '../page/calendar-page';

type Pages = {
    calendarPage: CalendarExamplePage
};

export const test = base.extend<Pages>({
    page: async ({ baseURL, page }, use) => {
        await page.goto(baseURL);
        await use(page);
    },

    calendarPage: async ({ page }, use) => {
        const calendarExamplePage = new CalendarExamplePage(page)
        await use(calendarExamplePage)
    }
});
