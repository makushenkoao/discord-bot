const Discord = require("discord.js");
const func = require("../../utils/functions");
const config = require("../../config.json");
const axios = require("axios");

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("joke")
    .setDescription("Laugh"),
  memberVoice: false,
  botVoice: false,
  sameVoice: false,
  queueNeeded: false,

  async execute(client, interaction, memberVC, botVC, queue) {
    await interaction.deferReply();

    try {
      const response = await axios.get(
        "https://v2.jokeapi.dev/joke/Any?type=single",
      );

      const joke = response.data.joke;

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
          text: `Commanded by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
        });

      return await interaction.editReply({ embeds: [errorEmbed] });
    }
  },
};
