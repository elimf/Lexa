//Get DISCORD_TOKEN
require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const { DISCORD_TOKEN } = process.env;

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
const onMessage = (message) => {
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
};
const onReady = () => {
  console.log(`${client.user.tag} à votre service`);
};

client.on("ready", onReady);
client.on("messageCreate", onMessage);
client.on("guildMemberAdd", newMembre);

client.login(DISCORD_TOKEN);
