import { expect, Locator, Page } from '@playwright/test';
import DateTimeHelper from '../util/date-time-helper';
import { DatePicker, TimePicker } from './module/date-time-picker';

import { WorkSpacePage } from './workspace-page';

export class CalendarExamplePage extends WorkSpacePage {

    readonly url
    readonly startDateInput: Locator
    readonly startTimeInput: Locator

    readonly endDateInput: Locator
    readonly endTimeInput: Locator

    constructor(page: Page) {
        super(page)

        this.url = '/' /* no relative path in the example project */
        this.startDateInput = page.locator('.date-text input').first()
        this.startTimeInput = page.locator('.time-picker-text input').first()

        this.endDateInput = page.locator('.date-text input').last()
        this.endTimeInput = page.locator('.time-picker-text input').last()
    }

    async open() {
        await this.page.goto(this.url)
        await expect(this.startDateInput).toBeVisible()
    }

    async setStartDate(dateString: string) {
        await this.setDateFilter(this.startDateInput, dateString)
    }

    async setEndDate(dateString: string) {
        await this.setDateFilter(this.endDateInput, dateString)
    }

    async setDateFilter(input: Locator, dateString: string) {
        const date = new DateTimeHelper(dateString)
        const datePicker = new DatePicker(input)

        await datePicker.open()
        await datePicker.selectYear(date.year())
        await datePicker.selectMonth(date.monthName())
        await datePicker.selectDate(date.day())
    }

    async setStartTime(timeString: string, { plusHours = 0, plusMinutes = 0 } = {}) {
        await this.setTime(this.startTimeInput, timeString, { plusHours, plusMinutes })
    }

    async setEndTime(timeString: string, { plusHours = 0, plusMinutes = 0 } = {}) {
        await this.setTime(this.endTimeInput, timeString, { plusHours, plusMinutes })
    }

    async setTime(input: Locator, timeString: string, { plusHours = 0, plusMinutes = 0 } = {}) {
        let date = new DateTimeHelper(timeString)
        date = date.plus({plusHours, plusMinutes})

        const timePicker = new TimePicker(input)
        await timePicker.open()

        if (date.isPm()) {
            await timePicker.setPm()
        } else {
            await timePicker.setAm()
        }

        await timePicker.selectHours(date.amPmHour())
        await timePicker.selectMinutes(date.minute())
        await timePicker.save()
    }

    async getStartDateTime() {
        return `${await this.startDateInput.inputValue()}, ${await this.startTimeInput.inputValue()}`
    }

    async getEndDateTime() {
        return `${await this.endDateInput.inputValue()}, ${await this.endTimeInput.inputValue()}`
    }
}
