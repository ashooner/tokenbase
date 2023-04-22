import type { Writable } from 'svelte/store';
import persistentWritable from './persistentWritable';
import { v4 as uuidv4 } from 'uuid';
import type { Group } from '$lib/types/group-interface';
import type { IToken, TokenType, TokenValue } from '$lib/types/token-interface';

export interface DesignTokensStore {
	subscribe: Writable<Group[]>['subscribe'];
	set: Writable<Group[]>['set'];
	addGroup: (parentGroupId: string, name: string, description?: string) => void;
	deleteGroup: (groupId: string) => void;
	addToken: <T extends TokenType>(
		groupId: string,
		name: string,
		type: T,
		value: TokenValue<T>
	) => void;
	deleteToken: (tokenId: string) => void;
}

const createTokensGroupStore = (): DesignTokensStore => {
	const { subscribe, update, set } = persistentWritable<Group[]>('designbase', [
		{
			id: 'root',
			name: 'Root',
			parentGroup: undefined,
			tokens: [],
		},
	]);

	const addGroup = (
		parentGroupId: string,
		name: string,
		description?: string
	): void => {
		update((designTokens) => {
			const parentGroup = designTokens.find(
				(group) => group.id === parentGroupId
			);

			if (!parentGroup) {
				console.error(`Parent group with ID ${parentGroupId} not found`);
				return designTokens;
			}

			const newGroupId = uuidv4();

			designTokens.push({
				id: newGroupId,
				name,
				description,
				parentGroup: parentGroupId,
				tokens: [],
			});

			return designTokens;
		});
	};

	const deleteGroup = (groupId: string): void => {
		update((designTokens) => {
			deleteGroupById(groupId, designTokens);

			return designTokens;
		});
	};

	const addToken = <T extends TokenType>(
		groupId: string,
		name: string,
		type: T,
		value: TokenValue<T>
	): void => {
		update((designTokens) => {
			// Find the group to add the token to
			const group = designTokens.find((group) => group.id === groupId);

			if (!group) {
				console.error(`Group with ID ${groupId} not found`);
				return designTokens;
			}

			// Add the new token to the group's tokens array
			group.tokens.push({
				id: uuidv4(),
				name,
				value,
				type,
			});

			return designTokens;
		});
	};

	const deleteToken = (tokenId: string): void => {
		update((designTokens) => {
			// Find the group that contains the token
			const group = designTokens.find((group) =>
				group.tokens.find((token) => token.id === tokenId)
			);

			if (!group) {
				console.error(`Token with ID ${tokenId} not found`);
				return designTokens;
			}

			// Delete the token from the group's tokens array
			deleteTokenById(tokenId, group.tokens);

			return designTokens;
		});
	};

	return {
		subscribe,
		set,
		addGroup,
		deleteGroup,
		addToken,
		deleteToken,
	};
};

const designTokensGroupStore = createTokensGroupStore();

export default designTokensGroupStore;

const deleteGroupById = (id: string, groups: Group[]): void => {
	const index = groups.findIndex((group) => group.id === id);
	if (index !== -1) {
		groups.splice(index, 1);
	}
};

const deleteTokenById = (id: string, tokens: IToken[]): void => {
	const index = tokens.findIndex((token) => token.id === id);
	if (index !== -1) {
		tokens.splice(index, 1);
	}
};
