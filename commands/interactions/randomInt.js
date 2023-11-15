const Discord = require('discord.js');
const config = require('../../config.json');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('random')
        .setDescription('Random integer.')
        .addIntegerOption((option) =>
            option
                .setName('from')
                .setDescription('To integer')
                .setRequired(false),
        )
        .addIntegerOption((option) =>
            option
                .setName('to')
                .setDescription('To integer')
                .setRequired(false),
        ),
    memberVoice: false,
    botVoice: false,
    sameVoice: false,
    queueNeeded: false,

    async execute(client, interaction) {
        await interaction.deferReply();

        try {
            const from = interaction.options.getInteger('from') || 1;
            const to = interaction.options.getInteger('to') || 100;

            const randomInt =
                Math.floor(Math.random() * (to - from + 1)) + from;

            const clsEmbed = new Discord.EmbedBuilder()
                .setColor(config.MAIN_COLOR)
                .setDescription(`Random integer - ${randomInt}`)
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
