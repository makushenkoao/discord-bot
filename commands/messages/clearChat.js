const Discord = require("discord.js");
const config = require("../../config.json");

module.exports = {
  name: "Cls",
  aliases: ["Clear", "CL"],
  description: "Clears chat messages.",
  memberVoice: false,
  botVoice: false,
  sameVoice: false,
  queueNeeded: false,

  async execute(client, message, args) {
    try {
      let amount = parseInt(args[0]) || 100;

      if (amount < 1 || amount > 100) {
        const invalidAmountEmbed = new Discord.EmbedBuilder()
          .setColor(config.ERROR_COLOR)
          .setDescription("The amount must be between 1 and 100.")
          .setFooter({
            text: `Команду ввел(а) ${message.author.tag}`,
            iconURL: message.author.displayAvatarURL({ size: 1024 }),
          });

        return await message.channel.send({ embeds: [invalidAmountEmbed] });
      }

      const messages = await message.channel.messages.fetch({ limit: amount });
      await message.channel.bulkDelete(messages);

      const clsEmbed = new Discord.EmbedBuilder()
        .setColor(config.MAIN_COLOR)
        .setDescription(`Deleted ${amount} messages.`)
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
