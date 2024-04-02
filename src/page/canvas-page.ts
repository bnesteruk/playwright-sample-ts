import { expect, Locator, Page } from '@playwright/test';

import { WorkSpacePage } from './workspace-page';

export class CanvasExamplePage extends WorkSpacePage {

    readonly url

    readonly geometryCanvas: Locator

    private readonly maskLocatorList: Locator[];
    private readonly maskColor = '#323233';

    constructor(page: Page) {
        super(page)
        this.url = `file://${process.cwd()}/src/components/CanvanPage.html`
        this.geometryCanvas = this.page.locator('#trussCanvas')
        this.maskLocatorList = [this.page.locator('#positionLabel')]
    }

    async open() {
        await this.page.goto(this.url)
        await expect(this.geometryCanvas).toBeVisible()
    }

    async moveGeometryByX(value: number) {
        let canvasProperties = await this.geometryCanvasProperties();

        /* Start from the center of the canvas */
        await this.page.mouse.move(canvasProperties.canvasCenterX, canvasProperties.canvasCenterY);
        await this.page.mouse.down();

        /* Playwright always calculates the coordinates from the left top viewport corner */
        await this.page.mouse.move(
            canvasProperties.canvasCenterX + value,
            canvasProperties.canvasCenterY,
            { steps: 30 }
        );
        await this.page.mouse.up();
        await this.commons.sleep(100);
    }

    async waitForGeometryToHaveScreenshot(
        screenshotName: string,
        options?: {
            failMessage?: string;
            maxDiffPixels?: number;
            timeout?: number;
        }
    ) {
        const extendedOptions = {
            ...options,
            mask: this.maskLocatorList,
            maskColor: this.maskColor,
        };

        await this.commons.sleep(1 * 1000);
        await expect(
            this.geometryCanvas,
            options?.failMessage || `Failed to wait for geometry to match screenshot ${screenshotName}`
        ).toHaveScreenshot(screenshotName, extendedOptions);
    }

    async geometryCanvasProperties() {
        await expect(this.geometryCanvas).toBeVisible({ timeout: 30 * 1000 });

        let canvasBox = (await this.geometryCanvas.boundingBox()) || {};
        let canvasLeftTopX = canvasBox['x'];
        let canvasLeftTopY = canvasBox['y'];
        return {
            canvasLeftTopX: canvasLeftTopX,
            canvasLeftTopY: canvasLeftTopY,
            canvasCenterX: canvasLeftTopX + canvasBox['width'] / 2,
            canvasCenterY: canvasLeftTopY + canvasBox['height'] / 2,
            canvasWidth: canvasBox['width'],
            canvasHeight: canvasBox['height'],
            canvasWidthQuarter: canvasBox['width'] / 4,
            canvasHeightQuarter: canvasBox['width'] / 4,
        };
    }
}
