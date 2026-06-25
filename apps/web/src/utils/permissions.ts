// ─── RBAC Permissions ───────────────────────────────────────────────────────

import type { UserRole, ZoneType } from '@vscp/shared-types';

/**
 * Check if a user role can edit cards in a given zone.
 */
export function canEditZone(role: UserRole, zoneType: ZoneType): boolean {
  // Technical founder can edit everything
  if (role === 'technical_founder') return true;
  // Agents can edit everything
  if (role === 'agent') return true;
  // Domain expert can only edit business and shared zones
  if (role === 'domain_expert') {
    return zoneType === 'business' || zoneType === 'shared';
  }
  return false;
}

/**
 * Check if a user role can view a zone.
 */
export function canViewZone(_role: UserRole, _zoneType: ZoneType): boolean {
  // All roles can view all zones (but with different edit permissions)
  return true;
}

/**
 * Check if a user role can view a section type.
 */
export function canViewSection(role: UserRole, sectionType: 'business' | 'technical'): boolean {
  if (role === 'technical_founder') return true;
  if (role === 'agent') return true;
  if (role === 'domain_expert') return sectionType === 'business';
  return false;
}

/**
 * Check if a user can create cards in a zone.
 */
export function canCreateCard(role: UserRole, zoneType: ZoneType): boolean {
  return canEditZone(role, zoneType);
}

/**
 * Check if a user can delete cards in a zone.
 */
export function canDeleteCard(role: UserRole, zoneType: ZoneType): boolean {
  return canEditZone(role, zoneType);
}

/**
 * Get the permission label for a zone based on role.
 */
export function getZonePermissionLabel(role: UserRole, zoneType: ZoneType): string {
  if (canEditZone(role, zoneType)) return 'Edit';
  return 'Read-Only';
}
