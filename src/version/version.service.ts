import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RELEASE_NOTES, type ReleaseNotes } from './release-notes';

export interface AppVersionInfo {
  /** Newest mobile app release published in the stores. */
  latestVersion: string;
  /** Older builds must update before they can keep using the app. */
  minSupportedVersion: string;
  /** What's new in [latestVersion]. Empty when none are written. */
  releaseNotes: string[];
  storeUrls: { android: string | null; ios: string | null };
}

/** Which mobile app release is current, so the app can tell users to update. */
@Injectable()
export class VersionService {
  constructor(
    private readonly config: ConfigService,
    @Inject(RELEASE_NOTES) private readonly notes: ReleaseNotes,
  ) {}

  getVersionInfo(): AppVersionInfo {
    const latestVersion = this.config.getOrThrow<string>('APP_LATEST_VERSION');
    return {
      latestVersion,
      minSupportedVersion: this.config.getOrThrow<string>('APP_MIN_VERSION'),
      releaseNotes: this.notes[latestVersion] ?? [],
      storeUrls: {
        android: this.config.get<string>('ANDROID_STORE_URL') || null,
        ios: this.config.get<string>('IOS_STORE_URL') || null,
      },
    };
  }
}
