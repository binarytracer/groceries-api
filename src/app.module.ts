import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { envValidationSchema } from './config/env.validation';
import { GroceriesModule } from './groceries/groceries.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),
    AuthModule,
    GroceriesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
