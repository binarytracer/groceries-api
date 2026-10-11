import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiProperty, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/public.decorator';
import { VersionService } from './version.service';

class StoreUrlsDto {
  @ApiProperty({
    nullable: true,
    example: 'https://play.google.com/store/apps/details?id=com.example.app',
  })
  android: string | null;

  @ApiProperty({
    nullable: true,
    example: 'https://apps.apple.com/app/id0000000000',
  })
  ios: string | null;
}

class VersionDto {
  @ApiProperty({
    example: '1.2.0',
    description: 'Newest mobile app release in the stores',
  })
  latestVersion: string;

  @ApiProperty({
    example: '1.0.0',
    description: 'Builds older than this must update',
  })
  minSupportedVersion: string;

  @ApiProperty({
    type: [String],
    example: ['Faster list loading', 'Fixed swipe to delete'],
    description: "What's new in latestVersion, from release-notes.json",
  })
  releaseNotes: string[];

  @ApiProperty({ type: StoreUrlsDto })
  storeUrls: StoreUrlsDto;
}

@ApiTags('Version')
@Public() // checked before sign-in, so no token
@Controller('version')
export class VersionController {
  constructor(private readonly version: VersionService) {}

  @Get()
  @ApiOkResponse({ type: VersionDto })
  getVersion(): VersionDto {
    return this.version.getVersionInfo();
  }
}
