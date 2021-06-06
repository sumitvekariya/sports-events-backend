import { NestFactory } from '@nestjs/core';
import { getBotToken } from 'nestjs-telegraf';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';
import * as fs from 'fs';

declare const module: any;
const httpsOptions = {
  key: fs.readFileSync('./secrets/cert.key'),
  cert: fs.readFileSync('./secrets/cert.pem'),
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions
  });

  if (process.env.NODE_ENV === 'production') {
    const bot = app.get(getBotToken());
    app.use(
      bot.webhookCallback(
        `https://${process.env.TELEGRAM_HOST}/${process.env.TELEGRAM_TOKEN}`,
      ),
    );
    app.use(helmet());
  }
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(parseInt(process.env.PORT));
}
bootstrap();
