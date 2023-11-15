const Discord = require("discord.js");
const config = require("../../config.json");

module.exports = {
  name: "8Ball",
  aliases: ["Ball"],
  description: "Find out the truth.",
  memberVoice: false,
  botVoice: false,
  sameVoice: false,
  queueNeeded: false,

  async execute(client, message, args) {
    try {
      const question = args.join(' ');

      if (!question) {
        const invalidAmountEmbed = new Discord.EmbedBuilder()
          .setColor(config.ERROR_COLOR)
          .setDescription("Please ask a question.")
          .setFooter({
            text: `Command by ${message.author.tag}`,
            iconURL: message.author.displayAvatarURL({ size: 1024 }),
          });

        return await message.channel.send({ embeds: [invalidAmountEmbed] });
      }

      const answers = [
        "Yes",
        "Of course",
        "Undoubtedly",
        "Tt must be so",
        "Possibly",
        "Little chances",
        "No",
        "The stars say no",
        "I can’t say",
        "It’s unknown now",
        "Ask Later",
      ];

      const answerIndex = Math.floor(Math.random() * (answers.length + 1));

      const clsEmbed = new Discord.EmbedBuilder()
        .setColor(config.MAIN_COLOR)
        .setDescription(`- ${question}\n- ${answers[answerIndex]}`)
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
