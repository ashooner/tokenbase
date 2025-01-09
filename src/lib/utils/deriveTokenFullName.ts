// utils/tokenUtils.ts

import type { Group } from '$lib/features/token-groups-store/types/group.interface';

/**
 * Derives the full name of a token by traversing the group hierarchy.
 * @param groupId - The ID of the current group.
 * @param tokenName - The name of the token.
 * @param groupsStore - The groups store containing all groups.
 * @returns The full token name as a string.
 */
export function deriveTokenFullName(
  groupId: string,
  tokenName: string,
  groupsStore: Group[]
): string {
  const groupNames: string[] = [];
  let currentGroupId: string | null = groupId;

  // Traverse up the group hierarchy
  while (currentGroupId) {
    const group = groupsStore.find((g) => g.id === currentGroupId);
    if (group) {
      groupNames.unshift(group.name || 'Untitled');
      currentGroupId = group.parentGroup || null;
    } else {
      break; // Exit if the group ID is invalid
    }
  }

  // Append the token name
  groupNames.push(tokenName || 'Unnamed');

  return groupNames.join('.');
}
