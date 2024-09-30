import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    cookieSession({
      keys: ['dddddd'],
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist: true strip out all property in the body not in dto
      whitelist: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
