import * as fs from 'fs'
import { Status } from './status.js'
import { Color } from './colors.js'
import { imageToBase64 } from './encodeImage.js'

export async function readAllureReport(reportPath, testEnvPath) {
	if (!fs.existsSync(reportPath)) {
		throw new Error('Report file not found.')
	}
	if (!fs.existsSync(testEnvPath)) {
		throw new Error('Test environment file not found.')
	}
	const report = fs.readFileSync(reportPath, 'utf-8')
	const environment = fs.readFileSync(testEnvPath, 'utf-8')

	let appName = ''
	let appVersion = ''
	let title = ''
	let color = Color.BLACK
	let image
	let text = ''
	let totalTests = 0

	if (!environment) {
		console.warn('Environment properties are not set')
	} else {
		const envProperties = JSON.parse(environment)
		appName =
			envProperties
				.find((envProp) => envProp.name === 'Application')
				?.values?.toString() ?? ''
		appVersion =
			envProperties
				.find((envProp) => envProp.name === 'Version')
				?.values?.toString() ?? ''
	}
	if (!report) {
		console.warn('Report is empty')
		title = 'Test report is empty'
		color = Color.BLACK
		image =
			'data:image/png;base64,' + imageToBase64('././assets/images/error.png')
		text = 'An error has occured and the test report is empty.'

		return { appName, appVersion, color, title, image, text }
	}

	const testsResults = JSON.parse(report)
	totalTests = testsResults.length
	const passedTests = testsResults.filter(
		(testRes) => testRes.status === Status.PASSED
	)
	const failedTests = testsResults.filter(
		(testRes) => testRes.status === Status.FAILED
	)
	const brokenTests = testsResults.filter(
		(testRes) => testRes.status === Status.BROKEN
	)
	const skippedTests = testsResults.filter(
		(testRes) => testRes.status === Status.SKIPPED
	)
	if (failedTests.length > 0) {
		title = `${failedTests.length} test case(s) failed`
		color = Color.RED
		image =
			'data:image/png;base64,' + imageToBase64('././assets/images/failed.png')
		text = `Failed test case(s): <br/> ${failedTests
			.map((failedTest) => failedTest.name)
			.join('<br/>')}`
	} else if (brokenTests.length > 0) {
		title =
			brokenTests.length === 1
				? `${brokenTests.length} test case is broken`
				: `${brokenTests.length} test cases are broken`
		color = Color.YELLOW
		image =
			'data:image/png;base64,' + imageToBase64('././assets/images/broken.png')
		text = `Broken test case(s): <br/> ${brokenTests
			.map((brokenTest) => brokenTest.name)
			.join('<br/>')}`
	} else if (
		passedTests.length > 0 &&
		passedTests.length === totalTests - skippedTests.length
	) {
		title = 'All test cases passed'
		color = Color.GREEN
		image =
			'data:image/png;base64,' + imageToBase64('././assets/images/passed.png')
	} else {
		title = 'Unknown Status'
		color = Color.BLACK
		image =
			'data:image/png;base64,' + imageToBase64('././assets/images/error.png')
		text =
			'Some of the tests have unknown status or the test results are missing.'
	}

	return { appName, appVersion, color, title, image, text }
}
