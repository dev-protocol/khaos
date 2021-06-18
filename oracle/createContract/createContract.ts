import { Context } from '@azure/functions'
import { NetworkName } from '@devprotocol/khaos-core'
import { call } from '@devprotocol/khaos-functions'
import { UndefinedOr, whenDefined, whenDefinedAll } from '@devprotocol/util-ts'
import { ethers } from 'ethers'
import { always, tryCatch } from 'ramda'

export const createContract = async (
	context: Context,
	id: string,
	network?: NetworkName
): Promise<
	readonly [
		UndefinedOr<ethers.Contract>,
		UndefinedOr<ethers.providers.InfuraProvider>,
		UndefinedOr<ethers.Wallet>
	]
> => {
	const khaosFunctions = call()
	const [address, abi] = await Promise.all([
		khaosFunctions({
			id,
			method: 'addresses',
			options: { network },
		}),
		khaosFunctions({ id, method: 'abi' }),
	])
	// eslint-disable-next-line functional/no-expression-statement
	context.log.info(`id:${id} address data:${address?.data}`)
	// eslint-disable-next-line functional/no-expression-statement
	context.log.info(`id:${id} abi data:${abi?.data}`)

	const provider = whenDefined(
		process.env.KHAOS_INFURA_ID,
		(infura) =>
			new ethers.providers.InfuraProvider(
				network === 'mainnet' ? 'homestead' : network,
				infura
			)
	)
	const wallet = whenDefinedAll(
		[provider, process.env.KHAOS_MNEMONIC],
		([prov, mnemonic]) => ethers.Wallet.fromMnemonic(mnemonic).connect(prov)
	)
	const contract = await whenDefinedAll(
		[address?.data, abi?.data],
		([adr, i]) =>
			tryCatch(
				(intf) =>
					((c) => c.resolvedAddress.then(always(c)).catch(always(undefined)))(
						new ethers.Contract(adr, intf, wallet)
					),
				always(undefined)
			)(i)
	)
	return [contract, provider, wallet]
}
