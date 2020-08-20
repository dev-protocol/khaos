import DiscordWebhook, { Webhook } from 'discord-webhook-ts'
import { Results } from './../idProcess/idProcess'

export const notification = async (
	results: readonly Results[] | undefined
): Promise<void> => {
	const errors = results?.filter((result) => result.sent === false)
	// TODO ここもどうにかする
	// eslint-disable-next-line functional/no-conditional-statement
	if (errors?.length === 0) {
		return
	}

	// TODO もっといい感じのメッセージを！
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
		process.env.DISCORD_NOTIFICATION_URL!
	)
	// eslint-disable-next-line functional/no-expression-statement
	await discordClient.execute(requestBody)
}
