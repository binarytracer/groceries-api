import { ConfigService } from '@nestjs/config';
import { VersionService } from './version.service';

const serviceWith = (
  values: Record<string, string>,
  notes: Record<string, string[]> = {},
) => new VersionService(new ConfigService(values), notes);

describe('VersionService', () => {
  it('returns the configured release info', () => {
    const service = serviceWith(
      {
        APP_LATEST_VERSION: '1.2.0',
        APP_MIN_VERSION: '1.0.0',
        ANDROID_STORE_URL: 'https://play.google.com/store/apps/details?id=x',
        IOS_STORE_URL: 'https://apps.apple.com/app/id1',
      },
      { '1.1.0': ['old'], '1.2.0': ['Faster list', 'Bug fixes'] },
    );

    expect(service.getVersionInfo()).toEqual({
      latestVersion: '1.2.0',
      minSupportedVersion: '1.0.0',
      releaseNotes: ['Faster list', 'Bug fixes'],
      storeUrls: {
        android: 'https://play.google.com/store/apps/details?id=x',
        ios: 'https://apps.apple.com/app/id1',
      },
    });
  });

  it('uses null for store URLs that are not set or empty', () => {
    const service = serviceWith({
      APP_LATEST_VERSION: '1.0.0',
      APP_MIN_VERSION: '1.0.0',
      IOS_STORE_URL: '',
    });

    expect(service.getVersionInfo().storeUrls).toEqual({
      android: null,
      ios: null,
    });
  });

  it('returns no release notes when the latest version has none', () => {
    const service = serviceWith(
      { APP_LATEST_VERSION: '2.0.0', APP_MIN_VERSION: '1.0.0' },
      { '1.0.0': ['old'] },
    );

    expect(service.getVersionInfo().releaseNotes).toEqual([]);
  });
});
