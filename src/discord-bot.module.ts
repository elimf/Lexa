import { ConfigModule, ConfigService } from '@nestjs/config';
import { DiscordModule } from '@discord-nestjs/core';
import { Module } from '@nestjs/common';
import { GatewayIntentBits } from 'discord.js';
import { BotGateway } from './bot.gateway';
import { PingCommand } from './command/ping.command';
import { ClearCommand } from './command/clear.command';

@Module({
  imports: [
    DiscordModule.forRootAsync({
      imports: [ConfigModule.forRoot()],
      inject: [ConfigService],
      useFactory: (configService) => ({
        token: configService.get('DISCORD_BOT_TOKEN'),
        discordClientOptions: {
          intents: [GatewayIntentBits.Guilds],
        },
        registerCommandOptions: [
          {
            forGuild: configService.get('DISCORD_GUILD_ID'),
            removeCommandsBefore: true,
          },
        ],
      }),
    }),
  ],
  providers: [BotGateway, PingCommand, ClearCommand],
})
export class DiscordBotModule {}
