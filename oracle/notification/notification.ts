import { when } from '../../common/util/when'
import DiscordWebhook, { Webhook } from 'discord-webhook-ts'
import { Results } from './../idProcess/idProcess'
import { sendInfo } from '../executeOraclize/executeOraclize'

export const notification = async (
	results: readonly Results[] | undefined
): Promise<void> => {
	const errors =
		typeof results === 'undefined'
			? []
			: results.filter((result) => result.sent === false)
	// eslint-disable-next-line functional/no-expression-statement
	await when(errors, (e) => Promise.all(e.map(sendMessage)))
}

const sendMessage = async function (result: Results): Promise<void> {
	const tmp = result.results.map(convertSendInfoToStr)
	const requestBody: Webhook.input.POST = {
		embeds: [
			{
				title: 'khaos',
				description: 'khaos callback error',
			},
			{
				fields: [
					{
						name: `address: ${result.address}`,
						value: `send info: ${tmp.join()}`,
					},
				],
			},
		],
	}
	const discordClient = when(
		process.env.KHAOS_DISCORD_NOTIFICATION_URL,
		(discordUrl) => new DiscordWebhook(discordUrl)
	)
	// eslint-disable-next-line functional/no-expression-statement
	await when(discordClient, (discord) => discord.execute(requestBody))
}

const convertSendInfoToStr = function (info: sendInfo): string {
	return `{"khaosId": "${info.khaosId}", "result": {"message": "${info.result?.message}", "status": "${info.result?.status}", "statusMessage": "${info.result?.statusMessage}"}}`
}
