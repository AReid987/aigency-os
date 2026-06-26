// ─── Skill Marketplace Types ─────────────────────────────────────────────────

export type SkillArgType = 'string' | 'number' | 'boolean' | 'json' | 'file';

export interface SkillArg {
  name: string;
  type: SkillArgType;
  description: string;
  required: boolean;
  default?: unknown;
}

export interface SkillManifest {
  /** Unique skill identifier (e.g. "gbrain.summarize") */
  id: string;
  /** Display name */
  name: string;
  /** SemVer version */
  version: string;
  /** Short description for marketplace listing */
  description: string;
  /** Author / org */
  author: string;
  /** Input arguments schema */
  args: SkillArg[];
  /** Average community rating (0–5) */
  rating: number;
  /** Tags for discovery */
  tags?: string[];
  /** Whether this skill requires network access */
  requiresNetwork?: boolean;
  /** Estimated max execution time in seconds */
  timeoutSeconds?: number;
}

export interface SkillVersion {
  /** Skill manifest ID */
  skillId: string;
  /** SemVer string */
  version: string;
  /** SHA-256 content hash for integrity */
  checksum: string;
  /** ISO-8601 release date */
  releasedAt: string;
  /** Changelog for this version */
  changelog?: string;
  /** Breaking changes flag */
  breaking?: boolean;
}

export type InstallationStatus = 'pending' | 'installed' | 'failed' | 'uninstalled';

export interface SkillInstallation {
  id: string;
  skillId: string;
  version: string;
  installedBy: string;
  status: InstallationStatus;
  config: Record<string, unknown>;
  installedAt: string;
  lastUsedAt?: string;
  invocationCount: number;
}
