import { test as base } from './page-fixtures';
import moment from 'moment';
import { ResourceHelper } from '../util/resource-helper';
import { DateTime, FixtureOptions } from './test-data-types'

type DataFixtures = {
    testData
}

type WorkerScopeDataFixtures = {
    dateTime: DateTime
}

export const test = base.extend<DataFixtures & FixtureOptions, WorkerScopeDataFixtures>({
    /**
     * Is defined ones per process worker 
     * Keeps run start date-time, provides the current time on demand.
     * Use `runStamp` as a suite's start time
     * Use `currentTime()` as a unique current time
     */
    dateTime: [async ({ }, use) => {
        let dateFormat = "MM-DD"
        let timeFormat = "HH-mm-ss"
        let now = moment()
        const date = now.format(dateFormat)
        const time = now.format(timeFormat)
        const runStamp = `${date}-${time}`
        const projectFormattedDate = now.format("M/D/YYYY")
        const currentTime = () => {
            let now = moment()
            return now.format(timeFormat)
        }
        await use({ date, time, runStamp, projectFormattedDate, currentTime });
    }, { scope: 'worker' }],

    testData: async ({ dateTime }, use, testInfo) => {
        const testIdPlaceholder = '<TEST_ID>'
        const specIdPlaceholder = '<SPEC_ID>'

        function processSpecTestIds(obj, testId: string, specId: string) {
            for (let prop in obj) {
                if (!!obj[prop] && typeof (obj[prop]) == "object") {
                    processSpecTestIds(obj[prop], testId, specId);
                } else if (typeof (obj[prop]) == "string") {
                    let replatesTimeProp = obj[prop].replace(testIdPlaceholder, testId).replace(specIdPlaceholder, specId)
                    obj[prop] = replatesTimeProp;
                }
            }
            return obj
        }

        let specData = await ResourceHelper.getSpecData(testInfo)
        let testData = specData[testInfo.title] || {}

        let prefix = str => str.split(/\s/).map(word => word[0].toLowerCase()).join('').substring(0, 3);
        let rolePr = testInfo.project.use['userRole'].substring(0, 2)
        let specPr = prefix(testInfo.titlePath[1])

        let testAbbr = testData.id || prefix(testInfo.title)
        testData.id = `${rolePr}_${testAbbr}_${dateTime.currentTime()}`.toUpperCase()
        let specId = `${rolePr}_${specPr}_${dateTime.time}`.toUpperCase()

        testData = processSpecTestIds(testData, testData.id, specId)
        testData.retry = testInfo.retry
        await testInfo.attach('Test input data', { body: JSON.stringify(testData, null, 2), contentType: 'application/json' });
        await use(testData)
    },
});

export { expect } from '@playwright/test';