import { expect, test } from '../../fixture/test-data-fixtures';

test.describe('Example of canvas content verification', () => {

    test('A user should be able to move a geometry',
        async ({ testData, canvasPage }) => {
            await canvasPage.open()
            await canvasPage.moveGeometryByX(testData.movementValue)
            await canvasPage
                .waitForGeometryToHaveScreenshot(testData.screenshot, {
                    maxDiffPixels: testData.maxDiffPixels.PLACEMENT_AREA_DATUM_POSITION,
                    failMessage: 'Table placement area on the batch form should reflect the changed X offset',
                });
        })

});