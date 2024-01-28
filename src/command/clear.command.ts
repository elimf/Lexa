import { Command, Handler, InteractionEvent } from '@discord-nestjs/core';
import { SlashCommandPipe } from '@discord-nestjs/common';
import { Injectable, UsePipes } from '@nestjs/common';
import {
  CommandInteraction,
  PermissionsBitField,
  TextChannel,
} from 'discord.js';

@Command({
  name: 'clear',
  description: 'Delete messages command',
})
@Injectable()
@UsePipes(SlashCommandPipe)
export class ClearCommand {
  @Handler()
  async onDelete(
    @InteractionEvent()
    interaction: CommandInteraction,
  ): Promise<string> {
    interaction.reply('Commande en cours de traitement...');
    // Vérifier si l'interaction est une commande slash
    if (!interaction.isCommand()) {
      return 'Cette commande ne peut être utilisée que via une interaction de type "slash".';
    }
    console.log(interaction);

    // Vérifier si l'utilisateur a la permission de gérer les messages
    const userPermissions = interaction.member?.permissions;
    if (
      userPermissions &&
      typeof userPermissions !== 'string' &&
      userPermissions.has(PermissionsBitField.Flags.ManageMessages)
    ) {
      //console.log(interaction.command);
      // Récupérer le nombre de messages à supprimer depuis les arguments (par défaut 1)
      const numberOfMessages = 1;

      // Assurer que le nombre de messages est dans une plage raisonnable
      if (numberOfMessages < 1 || numberOfMessages > 100) {
        return 'Veuillez spécifier un nombre entre 1 et 100.';
      }

      // Vérifier si le canal est défini
      if (interaction.channel) {
        // Assurer que le canal est un canal de texte
        if (interaction.channel instanceof TextChannel) {
          try {
            // Récupérer les derniers messages dans le canal
            const messages = await interaction.channel.messages.fetch({
              limit: numberOfMessages,
            });

            // Supprimer les messages
            await interaction.channel.bulkDelete(messages);
            return `Supprimé ${numberOfMessages} messages.`;
          } catch (error) {
            console.error(
              'Erreur lors de la suppression des messages :',
              error,
            );
            return "Une erreur s'est produite lors de la suppression des messages.";
          }
        } else {
          return 'Cette commande ne peut être utilisée que dans un canal de texte.';
        }
      } else {
        return "Impossible de déterminer le canal de l'interaction.";
      }
    } else {
      return "Vous n'avez pas les autorisations nécessaires pour exécuter cette commande.";
    }
  }
}
