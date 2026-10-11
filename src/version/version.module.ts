import { Module } from '@nestjs/common';
import { loadReleaseNotes, RELEASE_NOTES } from './release-notes';
import { VersionController } from './version.controller';
import { VersionService } from './version.service';

@Module({
  controllers: [VersionController],
  providers: [
    VersionService,
    { provide: RELEASE_NOTES, useFactory: loadReleaseNotes },
  ],
})
export class VersionModule {}
