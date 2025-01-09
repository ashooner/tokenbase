import type { Group } from '$lib/features/token-groups-store/types/group.interface'
import type { IToken } from '$lib/features/token-groups-store/types/token.interface'

export const resolveAliasRouteToIds = (
	aliasRoute: `{${string}}`,
	groups: Group[],
	designSystemId: string
  ):
	| {
		groupId: string;
		tokenId: string;
	  }
	| undefined => {
	// Split the alias path into parts
	const aliasRouteArray = aliasRoute
	  .replace('{', '')
	  .replace('}', '')
	  .split('.');
  
	// Handle optional `.value` at the end of the alias
	const lastSegment = aliasRouteArray[aliasRouteArray.length - 1];
	const isValueReference = lastSegment === 'value';
  
	// Determine the token name and groups path
	const tokenName = isValueReference
	  ? aliasRouteArray[aliasRouteArray.length - 2] // Second to last segment
	  : lastSegment; // Last segment if no `.value`
	const groupsRouteArray = isValueReference
	  ? aliasRouteArray.slice(0, aliasRouteArray.length - 2) // Remove `.value` and token name
	  : aliasRouteArray.slice(0, aliasRouteArray.length - 1); // Remove only token name
  
	// Traverse groups to find the referenced group
	const referencedGroup = groupsRouteArray.reduce(
	  (acc, groupName) => {
		const group = findGroupByNameAndParentId(groupName, acc.id, groups);
  
		if (group) {
		  return group;
		} else {
		  throw new Error(
			`Group ${groupName} not found in parent group ${acc.name}`
		  );
		}
	  },
	  { id: designSystemId, name: 'Design System', parentGroup: '' } as Group
	);
  
	// Find the token within the resolved group
	let referencedToken: IToken | undefined;
  
	if (referencedGroup) {
	  referencedToken = referencedGroup.tokens.find((t) => t.name === tokenName);
	}
  
	if (referencedGroup && referencedToken) {
	  return {
		groupId: referencedGroup.id,
		tokenId: referencedToken.id,
	  };
	} else {
	  return undefined;
	}
  };
  

const findGroupByNameAndParentId = (
	groupName: string,
	parentId: string,
	groups: Group[]
): Group | undefined => {
	const group = groups.find(
		(g) => g.name === groupName && g.parentGroup === parentId
	)

	if (group) {
		return group
	} else {
		return undefined
	}
}
