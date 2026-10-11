import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { envValidationSchema } from './config/env.validation';
import { VersionModule } from './version/version.module';
import { GroceriesModule } from './groceries/groceries.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    AuthModule,
    // Before GroceriesModule: its root-level `GET /:id` would otherwise match
    // `/version` first. Moving groceries under `/groceries` would remove this.
    VersionModule,
    GroceriesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
