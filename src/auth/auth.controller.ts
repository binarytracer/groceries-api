import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from './public.decorator';

class LoginDto {
  @ApiProperty({ example: 'admin' })
  username: string;

  @ApiProperty({ example: 'password123' })
  password: string;
}

class RefreshDto {
  @ApiProperty()
  refreshToken: string;
}

@ApiTags('Auth')
@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post()
  @HttpCode(200)
  login(@Body() body: LoginDto) {
    return this.auth.login(body?.username, body?.password);
  }

  @Post('refresh')
  @HttpCode(200)
  refresh(@Body() body: RefreshDto) {
    return this.auth.refresh(body?.refreshToken);
  }
}
