/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable functional/no-conditional-statement */
/* eslint-disable functional/no-expression-statement */

import DiscordWebhook, { Webhook } from 'discord-webhook-ts'
import { Results } from './../idProcess/idProcess'

export const notification = async (
	results: readonly Results[] | undefined
): Promise<void> => {
	const errors =
		typeof results === 'undefined'
			? []
			: results.filter((result) => result.sent === false)
	if (errors?.length === 0) {
		return
	}

	const requestBody: Webhook.input.POST = {
		embeds: [
			{
				title: 'khaos',
				description: 'khaos callback error',
			},
			{
				fields: [
					{
						name: `address: ${errors![0].address}`,
						value: `count: ${errors!.length}`,
					},
				],
			},
		],
	}
	const discordClient = new DiscordWebhook(
		process.env.KHAOS_DISCORD_NOTIFICATION_URL!
	)
	await discordClient.execute(requestBody)
}
