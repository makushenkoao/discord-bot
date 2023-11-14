const Discord = require("discord.js");
const func = require("../../utils/functions");
const config = require("../../config.json");

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("cls")
    .setDescription("Clears chat messages.")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Number of messages to delete")
        .setRequired(false),
    ),
  memberVoice: false,
  botVoice: false,
  sameVoice: false,
  queueNeeded: false,

  async execute(client, interaction, memberVC, botVC, queue) {
    await interaction.deferReply();

    try {
      let amount = interaction.options.getInteger("amount") || 100;

      if (amount < 1 || amount > 100) {
        return interaction.editReply("The amount must be between 1 and 100.");
      }

      const messages = await interaction.channel.messages.fetch({
        limit: amount,
      });
      await interaction.channel.bulkDelete(messages);

      const clsEmbed = new Discord.EmbedBuilder()
        .setColor(config.MAIN_COLOR)
        .setDescription(`Cleared ${amount} messages.`)
        .setFooter({
          text: `Commanded by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
        });

      return await interaction.editReply({ embeds: [clsEmbed] });
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
