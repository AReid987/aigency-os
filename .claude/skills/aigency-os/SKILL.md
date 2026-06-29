```markdown
# aigency-os Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill documents the core development patterns, conventions, and workflows used in the `aigency-os` TypeScript codebase. The repository is organized as a monorepo, with a focus on consistent dependency management, conventional commits, and clear coding standards. While no specific framework is detected, the project emphasizes maintainability and clarity in its structure and practices.

## Coding Conventions

### File Naming
- **Style:** camelCase
- **Example:**
  ```
  userService.ts
  apiClient.ts
  ```

### Import Style
- **Style:** Relative imports
- **Example:**
  ```typescript
  import { fetchData } from './apiClient';
  ```

### Export Style
- **Style:** Named exports
- **Example:**
  ```typescript
  // In userService.ts
  export function getUser(id: string) { ... }
  export const USER_ROLE = 'admin';
  ```

### Commit Messages
- **Type:** Conventional commits
- **Prefix Example:** `chore: update dependencies`
- **Typical Length:** ~77 characters

## Workflows

### Multi-Package Dependency Upgrade
**Trigger:** When you need to upgrade one or more npm dependencies across all relevant packages and apps in the monorepo.  
**Command:** `/upgrade-dependency <dependency-name> <version>`

**Step-by-step:**
1. **Identify all packages and apps using the dependency.**
   - Check for the dependency in each `package.json` within the monorepo.
2. **Update the dependency version in each package.json.**
   - Change the version string for the dependency to the desired version.
   - Example:
     ```json
     // Before
     "vitest": "^0.34.0"
     // After
     "vitest": "^0.35.0"
     ```
3. **Update the shared pnpm-lock.yaml file.**
   - Run `pnpm install` or the relevant package manager command to refresh the lockfile.
4. **Commit all changed package.json files and the lockfile together.**
   - Use a conventional commit message, e.g.:
     ```
     chore: upgrade vitest to ^0.35.0 across all packages
     ```

**Files Involved:**
- `*/package.json`
- `pnpm-lock.yaml`

**Frequency:** ~2-4 times per month

## Testing Patterns

- **Framework:** Unknown (not detected)
- **Test File Pattern:** Files named with `.test.` in their filename.
  - Example: `userService.test.ts`
- **Test Location:** Typically alongside or near the code being tested.

## Commands

| Command                                      | Purpose                                                      |
|-----------------------------------------------|--------------------------------------------------------------|
| /upgrade-dependency <dependency> <version>    | Upgrade a dependency across all packages in the monorepo      |
```
