import { Injectable, Logger } from '@nestjs/common';
import { On, Once, InjectDiscordClient } from '@discord-nestjs/core';
import { Client, Message, TextChannel } from 'discord.js';

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);

  constructor(@InjectDiscordClient() private readonly client: Client) {}

  @Once('ready')
  onReady(): void {
    this.logger.log(`Bot ${this.client.user?.tag} was started`);
  }

  @On('messageCreate')
  async onMessage(message: Message): Promise<void> {
    const prefix = '!';
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command =
      args && args.length > 0 ? args.shift()?.toLowerCase() : undefined;
    if (command === 'clear') {
      if (message.channel instanceof TextChannel) {
        const isServerOwner =
          message.guild && message.guild.ownerId === message.author.id;

        if (!isServerOwner) {
          message.channel.send(
            "Vous n'êtes pas autorisé à exécuter cette commande.",
          );
          return;
        }
        if (!args[0])
          message.channel
            .send('Tu dois spécifier un nombre de messages à supprimer !')
            .then((msg) => msg.delete());
        try {
          const numMessages = parseInt(args[0]);
          await message.channel.bulkDelete(numMessages);
          message.channel
            .send(`À ton service! (${numMessages}) `)
            .then((msg) => msg.delete());
        } catch (error) {
          message.channel.send(
            'Je ne peux pas supprimer plus de 100 messages à la fois et de plus de 14 jours.',
          );
        }
      }
    }
  }
}
