import * as dotenv from 'dotenv'
import { IncomingWebhook } from 'ms-teams-webhook'

dotenv.config()
const webhook = new IncomingWebhook(process.env.MS_TEAMS_WEBHOOK_URL)
export async function sendWebhook(args) {
	await webhook.send(
		JSON.stringify({
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
	)
}
