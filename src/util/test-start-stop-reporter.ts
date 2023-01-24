import { Reporter } from '@playwright/test/reporter';

class StartStopReporter implements Reporter {
    onBegin(config, suite) {
        console.log(`Starting a run with ${suite.allTests().length} tests`);
    }

    onTestBegin(test) {
        console.log(`Starting test ${test.title}`);
    }

    onTestEnd(test, result) {
        console.log(`Finished test ${test.title}: ${result.status}`);
    }

    onEnd(result) {
        console.log(`Finished the run: ${result.status}`);
    }
}
export default StartStopReporter;