import { Command, Handler, InteractionEvent } from '@discord-nestjs/core';
import { SlashCommandPipe } from '@discord-nestjs/common';
import { Injectable, UsePipes } from '@nestjs/common';
import { ChatInputCommandInteraction } from 'discord.js';
@Command({
  name: 'ping',
  description: 'Ping  command',
})
@Injectable()
@UsePipes(SlashCommandPipe)
export class PingCommand {
  @Handler()
  onPing(@InteractionEvent() interaction: ChatInputCommandInteraction): string {
    if (interaction.commandName === 'ping') {
      return `Oui gros chef bandit ${interaction.user}`;
    }
    return 'You must send ping';
  }
}
