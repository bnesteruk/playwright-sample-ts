# Playwright: page object and fixture usage example
## Project setup

### Required tools
* [VS Studio code](https://code.visualstudio.com/download)
* [Node.js & npm](https://nodejs.org/en/download)
* [Playwright Test for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)

### Checkout 
Navigate to the project folder and execute: 
```
git init
   # If you build on Windows:
   git config core.autocrlf true
git remote add origin <repo address>
git fetch origin
git checkout main 
```
### VS Studio workspace 
Navigate to the project folder and execute: 
```
code playwright-date-time-example.code-workspace
```
### Install
Install dependencies:
```
npm install
```
Install Playwright and browsers:
```
npx playwright install
```

## Test configuration

### Configuration
Additional environment variables can be defined in the `.env` file. 
All test suite settings are set in the `playwright.config.ts` config file.

### Parameterization 
Test input data and expected values are kept separately in the `.json` data files, and thus can be replaced based on an environment. 
The path to the data file should reflect the path to the spec itself. e.g.:

* Test parameters for the spec `src\spec\example\calendar.example.spec.ts` should be locatet at: `resource\test-data\example\calendar.example.spec.json`.
* Test name should match the object field name in the `.json` section name.

**Example**: 
```
# resource\test-data\example\calendar.example.spec.json
{
    "A user should be able to select the start date-time and end date-time": {
        "id": "T.C.E_1",
        "start": "7/14/2022, 2:04:24 PM",
        "end": "7/14/2022, 2:06:24 PM"
    }
}
```
The following placeholders are predefined:

*  `<TEST_ID>` - the unique timestamp per test. Includes the `userRole` 2-digit prefix, test case id prefix, test start timestamp; 
*  `<SPEC_ID>` - the unique timestamp per spec;

Should you have unique entries as a test input, put these placeholders to the test parameters: 
```
  "A user should be able to select the start date-time and end date-time": {
    "id": "T.C.E_1",`
    "companyInfo": {
      "company": "Company_<SPEC_ID>",
      "job": "Job_<TEST_ID>"
    }
  }
```
Parameters from the data files are being processed before the test start and are available inside a test as a `testData` fixture object. Put it as a test argument to use.

**Example**:
```
test('A user should be able to select the start date-time and end date-time', async ({ testData }) => {
    console.log(testData.companyInfo.job) // Job_GU_P.C.E_11_2_13-50-01
})
``` 

See the list of available data fixtures in [test-data-fixtures.ts](src\fixture\test-data-fixtures.ts) file.
See the list of available page fixtures in [page-fixtures.ts](src\fixture\page-fixtures.ts) file.
Playwight fixtures [documentation](https://playwright.dev/docs/test-fixtures).

## Demo application start
To run the test applciation: 
```
npm run serve
```
Expected output: 
```
App running at:
- Local:   http://localhost:8080/
```
The port may vary. Put the port number as the `UI_PORT` property in the `.env` file. 

## Test execution
To start all tests: 
```
npm test
```
Or run the configuration: `Launch all tests`

To start particular spec files: 
```
npm test operator_truss.details.at.board.display.spec.ts
```

To debug a single test (VS Code):
* Add the `only` annotation: `test.only('A user should be able to select the start date-time and end date-time'...)`
* Select the test spec in the editor and run the configuration: `Launch active tab test`
* To use the Playwright inspector, run the configuration: `Playwrite debug (active tab test)`

## Reporting
To see the aggregated HTML report of the last run, execute: 
```
npm run allure 
```
Or run the configuration: `Allure`

## Documentation references
* [Playwright automation framework](https://playwright.dev)