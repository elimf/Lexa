require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");
const SpotifyWebApi = require("spotify-web-api-js");
const spotifyApi = new SpotifyWebApi();
const config = require("./config.json");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});
const prefix = "!";

const newMembre = (member) => {
  member
    .createDM()
    .then((channel) => {
      return channel.send("Bienvenue sur mon serveur " + member.displayName);
    })
    .catch(console.error);
  // On pourrait catch l'erreur autrement ici (l'utilisateur a peut être désactivé les MP)
};
const onMessage = async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();

  // *HELP
  if (command === "help") {
    const file = new AttachmentBuilder("assets/trini.png");
    const exampleEmbed = new EmbedBuilder()
      .setColor("#00683E")
      .setTitle("Les commandes chez Lexa")
      .setAuthor({
        name: "Lexa",
        iconURL: "attachment://trini.png",
      })
      .setDescription("Liste des commandes ")
      .addFields(
        {
          name: "!clear {nombre}\n",
          value:
            "- J'effacerai les messages selon le nombres que vous me passer. \n  Attention je suis dans l'incapacibilité de supprimer les messages de plus 14 jours et ou  100 messages en meme temps.",
          inline: false,
        },
        {
          name: "!poll {question}\n",
          value:
            "- Je mettrais en place un sondage avec la question que vous désirez.\n",
            inline:true
        }
      )
      .setTimestamp()
      .setFooter({
        text: "by Lexa",
        iconURL: "attachment://trini.png",
      });

    message.channel.send({ embeds: [exampleEmbed], files: [file] });
  }
  // *BAN
  if (command === "ban") {
    let member = message.mentions.members.first();
    if (!member)
      return message.reply("Please mention a valid member of this server.");
    if (!member.bannable) return message.reply("I cannot ban this user.");
    let reason = args.slice(1).join(" ");
    if (!reason) reason = "No reason provided.";
    member
      .ban(reason)
      .catch((error) =>
        message.reply(
          `Sorry ${message.author} I couldn't ban because of : ${error}`
        )
      );
    message.reply(
      `${member.user.tag} has been banned by ${message.author.tag} because of: ${reason}`
    );
  }
  // * CLEAR
  if (command === "clear") {
    if (!args[0])
      return message.channel.send(
        "Tu dois spécifier un nombre de messages à supprimer !"
      );
    try {
      await message.channel.bulkDelete(args[0]);
      message.channel
        .send(`À ton service! (${args[0]}) `)
        .then((msg) => msg.delete(5000));
    } catch (error) {
      message.channel.send(
        "Je ne peux pas supprimer plus de 100 messages à la fois et de plus de 14 jours."
      );
    }
  }
  //* SONDAGE
  if (command === "poll") {
    if (message.content.startsWith("!poll")) {
      let args = message.content.split(" ").slice(1);
      let question = args.join(" ");
      if (!question)
        return message.reply("Please provide a question for the poll.");

      const filter = (reaction, user) => {
        return (
          ["✅", "❌"].includes(reaction.emoji.name) &&
          user.id === message.author.id
        );
      };

      message.channel.send(question).then((message) => {
        message.react("✅");
        message.react("❌");

        message
          .awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] })
          .then((collected) => {
            const reaction = collected.first();

            if (reaction.emoji.name === "✅") {
              message.reply("Poll passed!");
            } else {
              message.reply("Poll failed.");
            }
          })
          .catch((collected) => {
            message.reply("Poll ended without a result.");
          });
      });
    }
  }
  // * SPOTIFY
  if (command === "spotify") {
    spotifyApi.setAccessToken(config.SPOTIFY_TOKEN);
    try {
      spotifyApi.getMyDevices().then(
        function (data) {
          console.log(data);
        },
        function (err) {
          console.log(err);
        }
      );
    } catch (error) {
      console.log(error);
    }

    // spotifyApi
    //   .play({
    //     device_id: YOUR_DEVICE_ID,
    //   })
    //   .then(() => {
    //     console.log("Playback has started!");
    //   })
    //   .catch((err) => {
    //     console.log("Something went wrong!", err);
    //   });
  }

  //* join
  if (command === "join") {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.reply(
        "You need to be in a voice channel to use this command."
      );
    console.log(voiceChannel);
    // voiceChannel
    //   .join()
    //   .then((connection) => {
    //     message.reply("I have successfully joined the channel.");
    //   })
    //   .catch(console.error);
  }
  if (command === "move") {
    const targetChannel = message.mentions.channels.first();
    const targetMember = message.mentions.members.first();
    if (!targetChannel || !targetMember) {
      message.channel.send("Please mention a valid channel and member.");
      return;
    }

    targetMember
      .setVoiceChannel(targetChannel)
      .then(() => {
        message.channel.send(
          `Moved ${targetMember.displayName} to ${targetChannel}`
        );
      })
      .catch((error) => {
        message.channel.send(`Error: ${error}`);
      });
  }
};

const onReady = () => {
  console.log(`${client.user.tag} à votre service`);
};

client.on("ready", onReady);
client.on("messageCreate", onMessage);
client.on("guildMemberAdd", newMembre);
client.on("error", console.error);

client.login(config.BOT_TOKEN);
