import { NestFactory } from '@nestjs/core';
import { DiscordBotModule } from './discord-bot.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(DiscordBotModule);
}
bootstrap();
