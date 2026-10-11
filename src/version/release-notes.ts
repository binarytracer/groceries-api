import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** What's new, per app version. Edit api/release-notes.json when you release. */
export type ReleaseNotes = Record<string, string[]>;

export const RELEASE_NOTES = Symbol('RELEASE_NOTES');

// release-notes.json sits at the api root, two levels above src/version and
// dist/version.
export function loadReleaseNotes(): ReleaseNotes {
  try {
    return JSON.parse(
      readFileSync(join(__dirname, '..', '..', 'release-notes.json'), 'utf8'),
    ) as ReleaseNotes;
  } catch {
    return {}; // No file: the endpoint just returns no notes.
  }
}
