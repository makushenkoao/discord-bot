const Discord = require('discord.js');
const config = require('../../config.json');
const { translate } = require('free-translate');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('translate')
        .setDescription("Translate a language you don't understand.")
        .addStringOption((option) =>
            option
                .setName('from')
                .setDescription('From language. For example: "en"')
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName('to')
                .setDescription('To language. For example: "ru"')
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName('text')
                .setDescription('Text to be translated')
                .setRequired(true),
        ),
    memberVoice: false,
    botVoice: false,
    sameVoice: false,
    queueNeeded: false,

    async execute(client, interaction) {
        await interaction.deferReply();

        try {
            let from = interaction.options.getString('from');
            let to = interaction.options.getString('to');
            let text = interaction.options.getString('text');

            const translatedText = await translate(text, {
                from,
                to,
            });

            const translateEmbed = new Discord.EmbedBuilder()
                .setColor(config.MAIN_COLOR)
                .setDescription(`- ${text}\n- ${translatedText}`)
                .setFooter({
                    text: `Commanded by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
                });

            await interaction.editReply({ embeds: [translateEmbed] });
        } catch (error) {
            const errorEmbed = new Discord.EmbedBuilder()
                .setColor(config.ERROR_COLOR)
                .setDescription(
                    error.message.length > 4096
                        ? error.message.slice(0, 4093) + '...'
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
