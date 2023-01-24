import { TestInfo } from "@playwright/test";
import fs from 'fs';
import path from 'path'
import JSZip from 'JSZip';

export class ResourceHelper {
    static readonly RESOURCE_FOLDER = `${__dirname}/../../resource`
    static readonly TEST_ARTIFACTS_FOLDER = `${__dirname}/../../build/test-artifacts`

    static getInputFilePath(fileName: string) {
        return path.resolve(ResourceHelper.TEST_ARTIFACTS_FOLDER, fileName)
    }

    static async readFile(filePath: string) {
        return fs.readFileSync(path.resolve(filePath), 'utf8')
    }

    static async writeFile(filePath: string, fileData) {
        return fs.writeFileSync(path.resolve(filePath), fileData)
    }

    static async getSpecData(specInfo: TestInfo) {
        let fileText = fs.readFileSync(path.resolve(`${ResourceHelper.RESOURCE_FOLDER}/test-data/${specInfo.titlePath[0].replace('ts', 'json')}`), 'utf8')
        if (!fileText) {
            console.error(`Failed to read data-file for: ${specInfo.titlePath[0]}`)
        }
        return JSON.parse(fileText)
    }

    static async unZip(filePath) {
        let fileData = await ResourceHelper.readFile(filePath)
        return JSZip.loadAsync(fileData)
            .then((zip) => {
                const fileContentPromises = Object.keys(zip.files).map((fileName) => {
                    return zip.files[fileName].async('string').then((content) => {
                        return {
                            name: fileName,
                            content: content,
                        };
                    });
                });
                return Promise.all(fileContentPromises).then((values) => {
                    return values.reduce((result, item) => {
                        result[item.name] = item.content;
                        return result;
                    }, {});
                });
            })
            .catch((ex) => {
                console.error(ex);
                throw ex;
            });
    }
}