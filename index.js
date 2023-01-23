//Get DISCORD_TOKEN
require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { DISCORD_TOKEN } = process.env;
const ytdl = require("ytdl-core");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const newMembre = (member) => {
  member
    .createDM()
    .then((channel) => {
      return channel.send("Bienvenue sur mon serveur " + member.displayName);
    })
    .catch(console.error);
  // On pourrait catch l'erreur autrement ici (l'utilisateur a peut être désactivé les MP)
};
const onMessage =  async (message) => {
  if (message.author.bot) return;
  if (message.content === "!hello") {
    message.channel.send("Welcome to the server, " + message.author + "!");
  }
  if (message.member.voice.channel) {
    message.member.voice.channel
      .join()
      .then((connection) => {
        message.channel.send("I have joined the voice channel!");
      })
      .catch(console.log);
  } else {
    message.channel.send("You need to join a voice channel first!");
  }

  if (message.content === "zebi") {
    message.channel.send("Zebi Zebi");
  }
// * CLEAR
  if (message.content === "!clear") {
    message.channel.messages.fetch({ limit: 10 }).then((messages) => {
      message.channel.bulkDelete(messages);
    });
  }
  // * YOUTUBE
  if (message.content === "!play") {
    const streamOptions = { seek: 0, volume: 1 };
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel)
      return message.reply("Please join a voice channel first!");
    voiceChannel
      .join()
      .then((connection) => {
        const stream = ytdl(
          "https://www.youtube.com/watch?v=YOUTUBE_VIDEO_ID",
          { filter: "audioonly" }
        );
        const dispatcher = connection.play(stream, streamOptions);
        dispatcher.on("end", () => voiceChannel.leave());
      })
      .catch(console.error);
  }
  // *BAN
  if (message.content.startsWith("!ban")) {
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
};

const onReady = () => {
  console.log(`${client.user.tag} à votre service`);
};

client.on("ready", onReady);
client.on("messageCreate", onMessage);
client.on("guildMemberAdd", newMembre);

client.login(DISCORD_TOKEN);
