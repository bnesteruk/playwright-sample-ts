
import { Locator, expect } from '@playwright/test';
import { BaseModule } from './base-module';

export class DatePicker extends BaseModule {

    readonly wrapper: Locator

    readonly dateInputLocator: Locator
    readonly previousMonthBtn: Locator
    readonly nextMonthBtn: Locator
    readonly monthYearBtn: Locator

    readonly yearList: Locator

    readonly monthTable: Locator
    readonly dateTable: Locator

    constructor(dateInputLocator: Locator) {
        super(dateInputLocator.page())

        this.dateInputLocator = dateInputLocator
        this.wrapper = this.page.locator('.v-picker__body:visible')

        this.previousMonthBtn = this.wrapper.locator('button[aria-label="Previous month"]')
        this.nextMonthBtn = this.wrapper.locator('button[aria-label="Next month"]')
        this.monthYearBtn = this.wrapper.locator('.v-date-picker-header__value button')
        this.yearList = this.wrapper.locator('ul.v-date-picker-years')

        this.monthTable = this.wrapper.locator('.v-date-picker-table--month')
        this.dateTable = this.wrapper.locator('.v-date-picker-table--date')

    }

    async waitFor() {
        await expect(this.wrapper).toBeVisible()
    }

    async open() {
        await this.dateInputLocator.click()
        await this.waitFor()
    }

    async selectYear(year: number | string) {
        await this.monthYearBtn.click()
        await expect(this.monthTable).toBeVisible()

        await expect(this.monthYearBtn).toHaveCount(1)

        await this.monthYearBtn.click()
        await expect(this.yearList).toBeVisible()

        await this.yearList.locator(`text="${year}"`).click()
        await expect(this.monthTable).toBeVisible()
        await expect(this.monthYearBtn).toContainText(`${year}`)
    }

    async selectMonth(name: string) {
        const monthTableVisible = await this.monthTable.isVisible()
        if (!monthTableVisible) {
            await this.monthYearBtn.click()
            await expect(this.monthTable).toBeVisible()
        }
        const monthBtn = this.monthTable.locator('td button', {
            hasText: name.slice(0, 3).toUpperCase()
        })

        await monthBtn.click()
        await expect(this.monthYearBtn.first()).toContainText(name)
    }

    async selectDate(day: number | string) {
        day = day.toString()

        await expect(this.dateTable).toBeVisible()

        const dateBtn = this.dateTable.locator('td button', {
            has: this.page.locator(`text="${day}"`)
        })

        await dateBtn.click()
        await expect(dateBtn).toHaveClass(/v-btn--active/)
        await expect(this.wrapper).toBeHidden()
    }

}

export class TimePicker extends BaseModule {

    readonly timeInputLocator: Locator
    readonly wrapper: Locator

    readonly amBtn: Locator
    readonly pmBtn: Locator

    readonly cancelBtn: Locator
    readonly okBtn: Locator

    readonly clockContainer: Locator
    readonly zeroMinute: Locator

    constructor(timeInputLocator: Locator) {
        super(timeInputLocator.page())

        this.timeInputLocator = timeInputLocator
        this.wrapper = this.page.locator('.v-picker--time:visible')

        this.amBtn = this.wrapper.locator('.v-picker__title__btn').first()
        this.pmBtn = this.wrapper.locator('.v-picker__title__btn').last()

        this.cancelBtn = this.wrapper.locator('button.v-btn.primary--text').first()
        this.okBtn = this.wrapper.locator('button.v-btn.primary--text').last()

        this.clockContainer = this.wrapper.locator('.v-time-picker-clock')
        this.zeroMinute = this.clockContainer.locator('span:text("00")')
    }

    async waitFor() {
        await expect(this.wrapper).toBeVisible()
    }

    async open() {
        await this.timeInputLocator.click()
        await this.waitFor()
    }

    async setAm() {
        await this.amBtn.click()
        await expect(this.amBtn).toHaveClass(/v-picker__title__btn--active/)
    }

    async setPm() {
        await this.pmBtn.click()
        await expect(this.pmBtn).toHaveClass(/v-picker__title__btn--active/)
    }

    async selectHours(hours: number | string) {
        hours = hours.toString()
        await expect(this.clockContainer).toBeVisible()

        const item = this.clockContainer.locator('.v-time-picker-clock__item', {
            has: this.page.locator(`text="${hours}"`)
        }).locator('span')

        await item.click()
        await expect(this.zeroMinute).toBeVisible()
        let inputHoursValue = await this.timeInputLocator.inputValue()
        await expect(inputHoursValue.split(':')[0]).toContain(hours)
    }

    async selectMinutes(minutes: number) {
        /* If can click on the visible time label - do this */
        if (minutes % 5 == 0) {
            const minutesText = ('0' + minutes).slice(-2) // add starting '0' if the value < 10
            const item = this.clockContainer.locator('.v-time-picker-clock__item', {
                has: this.page.locator(`text="${minutesText}"`)
            })
            await item.locator('span').click()
            await expect(item).toHaveClass(/v-time-picker-clock__item--active/)

            let inputMinutesValue = await this.timeInputLocator.inputValue()
            await expect(inputMinutesValue.split(':')[1]).toContain(minutesText)
        } else {
            /* Need to find the point to click at the clock face */
            const clockFaceContainer = this.wrapper.locator('.v-time-picker-clock__inner')
            await expect(clockFaceContainer).toHaveCount(1)

            const box = await clockFaceContainer.boundingBox() || {}
            const radius = box['width'] / 2

            const degreePerMinute = 360 / 60
            const axisCorrectionAngle = 90 // start from the 12th (Y axis, not X)
            const minuteAngleDegrees = degreePerMinute * minutes - axisCorrectionAngle
            const radiansAngle = minuteAngleDegrees * Math.PI / 180

            const minuteX = radius * Math.cos(radiansAngle)
            const minuteY = radius * Math.sin(radiansAngle)

            const boxCenterX = box['x'] + box['width'] / 2
            const boxCenterY = box['y'] + box['height'] / 2

            await this.page.mouse.move(boxCenterX, boxCenterY)
            await this.page.mouse.click(boxCenterX + minuteX, boxCenterY + minuteY)

            let inputMinutesValue = await this.timeInputLocator.inputValue()
            await expect(inputMinutesValue.split(':')[1]).toContain(minutes.toString())
        }
    }

    async save() {
        await this.okBtn.click()
        await expect(this.wrapper).toBeHidden()
    }

    async cancel() {
        await this.cancelBtn.click()
        await expect(this.wrapper).toBeHidden()
    }

}