const Discord = require('discord.js');
const config = require('../../config.json');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('kiss')
        .setDescription('Kiss a user.')
        .addUserOption((option) =>
            option
                .setName('target')
                .setDescription('The user you want to kiss.')
                .setRequired(true),
        ),
    memberVoice: false,
    botVoice: false,
    sameVoice: false,
    queueNeeded: false,

    async execute(client, interaction) {
        await interaction.deferReply();

        try {
            const targetUser = interaction.options.getUser('target');

            if (targetUser.id === interaction.user.id) {
                const selfHugEmbed = new Discord.EmbedBuilder()
                    .setColor(config.ERROR_COLOR)
                    .setDescription(
                        `**${interaction.user.username}**, you can't kiss yourself!`,
                    )
                    .setFooter({
                        text: `Commanded by ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL({
                            size: 1024,
                        }),
                    });

                return await interaction.editReply({ embeds: [selfHugEmbed] });
            }

            const kissGif =
                'https://media.giphy.com/media/9d3LQ6TdV2Flo8ODTU/giphy.gif';

            const hugEmbed = new Discord.EmbedBuilder()
                .setColor(config.MAIN_COLOR)
                .setDescription(
                    `**${interaction.user.username}** kissed **${targetUser.username}**  💋`,
                )
                .setImage(kissGif)
                .setFooter({
                    text: `Commanded by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
                });

            return await interaction.editReply({ embeds: [hugEmbed] });
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
