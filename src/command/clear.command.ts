import { Command, Handler, IA, InteractionEvent } from '@discord-nestjs/core';
import { SlashCommandPipe } from '@discord-nestjs/common';
import { Injectable, UsePipes } from '@nestjs/common';
import { CommandInteraction, Permissions, TextChannel } from 'discord.js';

@Command({
  name: 'clear',
  description: 'Delete messages command',
})
@Injectable()
@UsePipes(SlashCommandPipe)
export class ClearCommand {
  @Handler()
  async onDelete(
    @IA() args: string[],
    @InteractionEvent() interaction: CommandInteraction,
  ): Promise<string> {
    // Vérifiez si l'utilisateur a les autorisations nécessaires pour supprimer des messages
    if (
      interaction.member &&
      interaction.member.permissions instanceof Permissions
    ) {
      // Récupérez le nombre de messages à supprimer depuis les arguments (par défaut 1)
      const numberOfMessages = parseInt(args[0]) || 1;

      // Assurez-vous que le nombre de messages est dans une plage raisonnable
      if (numberOfMessages < 1 || numberOfMessages > 100) {
        return 'Veuillez spécifier un nombre entre 1 et 100.';
      }

      // Vérifiez si le canal est défini
      if (interaction.channel) {
        // Assurez-vous que le canal est un canal de texte
        if (interaction.channel instanceof TextChannel) {
          // Récupérez les derniers messages dans le canal
          const messages = await interaction.channel.messages.fetch({
            limit: numberOfMessages,
          });

          // Supprimez les messages
          interaction.channel
            .bulkDelete(messages)
            .then(() => {
              interaction.reply(`Supprimé ${numberOfMessages} messages.`);
            })
            .catch((error) => {
              console.error(
                'Erreur lors de la suppression des messages :',
                error,
              );
              interaction.reply(
                "Une erreur s'est produite lors de la suppression des messages.",
              );
            });
        } else {
          return 'Cette commande ne peut être utilisée que dans un canal de texte.';
        }
      } else {
        return "Impossible de déterminer le canal de l'interaction.";
      }

      // Vous pouvez également retourner une réponse, mais l'utilisation de `interaction.reply` est plus courante.
      return 'Commande traitée';
    } else {
      return "Vous n'avez pas les autorisations nécessaires pour exécuter cette commande.";
    }
  }
}
