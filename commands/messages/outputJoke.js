const Discord = require("discord.js");
const config = require("../../config.json");
const axios = require("axios");

module.exports = {
  name: "Joke",
  aliases: ["JK"],
  description: "Laugh",
  memberVoice: false,
  botVoice: false,
  sameVoice: false,
  queueNeeded: false,

  async execute(client, message) {
    try {
      const response = await axios.get(
        "https://v2.jokeapi.dev/joke/Any?type=single",
      );

      const joke = response.data.joke

      const clsEmbed = new Discord.EmbedBuilder()
        .setColor(config.MAIN_COLOR)
        .setDescription(`Joke \n${joke}`)
        .setFooter({
          text: `Commanded by ${message.author.tag}`,
          iconURL: message.author.displayAvatarURL({ size: 1024 }),
        });

      return await message.channel.send({ embeds: [clsEmbed] });
    } catch (error) {
      const errorEmbed = new Discord.EmbedBuilder()
        .setColor(config.ERROR_COLOR)
        .setDescription(
          error.message.length > 4096
            ? error.message.slice(0, 4093) + "..."
            : error.message,
        )
        .setFooter({
          text: `Commanded by ${message.author.tag}`,
          iconURL: message.author.displayAvatarURL({ size: 1024 }),
        });

      return await message.channel.send({ embeds: [errorEmbed] });
    }
  },
};
