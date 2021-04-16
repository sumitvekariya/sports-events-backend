import { NestFactory } from '@nestjs/core';
import { getBotToken } from 'nestjs-telegraf';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'production') {
    const bot = app.get(getBotToken());
    app.use(
      bot.webhookCallback(
        `https://${process.env.TELEGRAM_HOST}/${process.env.TELEGRAM_TOKEN}`,
      ),
    );
  }
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(parseInt(process.env.PORT));
}
bootstrap();
