const Discord = require("discord.js");
const config = require("../../config.json");

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Find out the truth.")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("Ask your question")
        .setRequired(true),
    ),
  memberVoice: false,
  botVoice: false,
  sameVoice: false,
  queueNeeded: false,

  async execute(client, interaction, memberVC, botVC, queue) {
    await interaction.deferReply();

    try {
      let question = interaction.options.getString("question");

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
          text: `Commanded by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
        });

      await interaction.editReply({ embeds: [clsEmbed] });
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
