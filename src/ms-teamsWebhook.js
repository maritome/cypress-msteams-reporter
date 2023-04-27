require('dotenv').config()
const { IncomingWebhook } = require('ms-teams-webhook')

async function sendWebhook(args) {
	const webhook = new IncomingWebhook(process.env.MS_TEAMS_WEBHOOK_URL)
	await webhook.send({
		
			'@type': 'MessageCard',
			'@context': 'https://schema.org/extensions',
			summary: 'E2E Tests',
			themeColor: args.color,
			title: args.title,
			sections: [
				{
					activityTitle: args.appName,
					activitySubtitle: args.appVersion,
					activityImage: args.image,
					text: args.text,
				},
			],
			potentialAction: [
				{
					'@context': 'http://schema.org',
					'@type': 'ViewAction',
					name: 'Open Test Report',
					target: [args.reportUrl],
				},
			],
		
		})
}
module.exports = { sendWebhook }
