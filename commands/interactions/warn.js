const Discord = require('discord.js');
const config = require('../../config.json');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warning to user.')
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('The user you want to write a warning to.')
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName('reason')
                .setDescription('Select the appropriate warning.')
                .setRequired(true)
                .setChoices(
                    {
                        name: 'First warning',
                        value: 'Please be mindful of the community guidelines.',
                    },
                    {
                        name: 'Second warning',
                        value: 'Your behavior is not in line with our community standards.',
                    },
                    {
                        name: 'Final warning',
                        value: 'This is your final warning.',
                    },
                    {
                        name: 'Ban',
                        value: 'Your account has been permanently banned due to severe.',
                    },
                ),
        ),
    memberVoice: false,
    botVoice: false,
    sameVoice: false,
    queueNeeded: false,

    async execute(client, interaction) {
        try {
            await interaction.deferReply();

            const reason = interaction.options.getString('reason');
            const user = interaction.options.getUser('user');

            const warnEmbed = new Discord.EmbedBuilder()
                .setColor(config.WARN_COLOR)
                .setTitle('WARNING!')
                .setDescription(reason)
                .setFooter({
                    text: `Commanded by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
                });

            await user.send({ embeds: [warnEmbed] });

            const infoEmbed = new Discord.EmbedBuilder()
                .setColor(config.MAIN_COLOR)
                .setDescription(
                    `A warning has been issued to the user ${user.username}`,
                )
                .setFooter({
                    text: `Commanded by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
                });

            return await interaction.editReply({ embeds: [infoEmbed] });
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
