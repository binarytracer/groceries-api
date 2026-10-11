import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Groceries API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, config));

  const ip = configService.getOrThrow<string>('IP');
  const port = configService.getOrThrow<number>('PORT');
  await app.listen(port);
  console.log(`Server is running on http://${ip}:${port}`);
  console.log(`IP: ${ip}`);
  console.log(`Port: ${port}`);
  console.log(`Swagger docs: http://${ip}:${port}/docs`);
}
bootstrap();
