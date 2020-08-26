import { whenDefined } from '../../common/util/whenDefined'
import DiscordWebhook, { Webhook } from 'discord-webhook-ts'
import { Results } from './../idProcess/idProcess'
import { sendInfo } from '../executeOraclize/executeOraclize'
import { always } from 'ramda'

export const notification = async (
	results: readonly Results[] | undefined
): Promise<
	ReadonlyArray<ReturnType<DiscordWebhook['execute']> | undefined> | undefined
> => {
	const errors = whenDefined(results, (res) =>
		res.filter((r) => r.sent === false)
	)
	return whenDefined(errors, (e) => Promise.all(e.map(sendMessage)))
}

const sendMessage = async function (
	result: Results
): Promise<ReturnType<DiscordWebhook['execute']> | undefined> {
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
	const discordClient = whenDefined(
		process.env.KHAOS_DISCORD_NOTIFICATION_URL,
		(discordUrl) => new DiscordWebhook(discordUrl)
	)
	return whenDefined(discordClient, (discord) =>
		discord.execute(requestBody).catch(always(undefined))
	)
}

const convertSendInfoToStr = function (info: sendInfo): string {
	return `{"khaosId": "${info.khaosId}", "result": {"message": "${info.result?.message}", "status": "${info.result?.status}", "statusMessage": "${info.result?.statusMessage}"}}`
}
