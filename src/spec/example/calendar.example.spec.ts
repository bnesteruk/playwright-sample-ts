import DateTimeHelper from '../../util/date-time-helper';
import { expect, test } from '../../fixture/test-data-fixtures';

test.describe('Example of a funcional test for selecting dates and time in a vue calendar via UI', () => {

    test('A user should be able to select the start date-time and end date-time',
        async ({ testData, calendarPage }) => {
            await calendarPage.open()

            for (const date of testData.dateList) {

                await calendarPage.setStartDate(date.value)
                await calendarPage.setStartTime(date.value)
                await calendarPage.setEndDate(date.value)
                await calendarPage.setEndTime(date.value, date.correction)

                await expect.poll(async () => {
                    return calendarPage.getStartDateTime()
                }).toEqual(date.value)

                const expectedDateWithCorrection = new DateTimeHelper(date.value).plus(date.correction).toString()

                await expect.poll(async () => {
                    return calendarPage.getEndDateTime()
                }).toEqual(expectedDateWithCorrection)
            }
        })

    test.skip('Skipped test example', async ({ testData, calendarPage }) => {
        await calendarPage.open()
    })


    test('Retry test example', async ({ testData, calendarPage }) => {
        await calendarPage.open()
        await calendarPage.getStartDateTime()

        if (testData.retry === 0) {
            await expect(calendarPage.startDateInput).not.toBeVisible()
        } else {
            await expect(calendarPage.startDateInput).toBeVisible()
        }
    })

    for (const testData of [
        {
            value: "7/14/2022, 2:04 PM",
            correction: {
                "plusMinutes": 45
            }
        },
        {
            value: "3/03/2022, 10:14 AM",
            correction: {
                "plusMinutes": 0
            }
        }]) {
        test(`Repeatable test example, setting the date ${testData.value}`,
            async ({ calendarPage }) => {
                await calendarPage.setEndDate(testData.value)
                await calendarPage.setEndTime(testData.value)

                await expect.poll(async () => {
                    return calendarPage.getEndDateTime()
                }).toEqual(testData.value)

                const expectedDateWithCorrection = new DateTimeHelper(testData.value).plus(testData.correction).toString()

                await expect.poll(async () => {
                    return calendarPage.getEndDateTime()
                }).toEqual(expectedDateWithCorrection)
            })
    }
});