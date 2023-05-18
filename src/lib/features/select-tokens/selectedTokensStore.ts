import { writable } from 'svelte/store'
import type { IToken } from '../token-groups-store/types/token-interface'

export const createSelectedTokensStore = () => {
	const { subscribe, update, set } = writable<IToken[]>([])

	const addToken = (token: IToken): void => {
		update((tokens) => {
			tokens.push(token)

			return tokens
		})
	}

	const removeToken = (token: IToken): void => {
		update((tokens) => {
			const index = tokens.findIndex((t) => t.id === token.id)

			if (index !== -1) {
				tokens.splice(index, 1)
			}

			return tokens
		})
	}

	const clearTokens = (): void => {
		set([])
	}

	return {
		subscribe,
		set,
		addToken,
		removeToken,
		clearTokens
	}
}

const selectedTokensStore = createSelectedTokensStore()

export default selectedTokensStore
