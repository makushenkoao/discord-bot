const Discord = require('discord.js');
const config = require('../../config.json');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('vote')
        .setDescription('Starts a vote.')
        .addStringOption((option) =>
            option
                .setName('question')
                .setDescription('The question for the vote.')
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName('options')
                .setDescription('Options for the vote, separated by commas.')
                .setRequired(true),
        ),
    memberVoice: false,
    botVoice: false,
    sameVoice: false,
    queueNeeded: false,

    async execute(client, interaction) {
        await interaction.deferReply();

        try {
            const question = interaction.options.getString('question');
            const options = interaction.options.getString('options').split(',');

            const voteEmbed = new Discord.EmbedBuilder()
                .setColor(config.MAIN_COLOR)
                .setTitle('Vote')
                .setDescription(question)
                .addFields({
                    name: 'Options',
                    value: options
                        .map((option, index) => `${index + 1}. ${option}`)
                        .join('\n'),
                })
                .setFooter({
                    text: `Initiated by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
                });

            await interaction.editReply({ embeds: [voteEmbed] });

            for (let i = 1; i <= options.length; i++) {
                await interaction
                    .fetchReply()
                    .then((msg) => msg.react(`${i}\u20e3`));
            }
        } catch (error) {
            const errorEmbed = new Discord.EmbedBuilder()
                .setColor(config.ERROR_COLOR)
                .setDescription(
                    error.message.length > 4096
                        ? error.message.slice(0, 4093) + '...'
                        : error.message,
                )
                .setFooter({
                    text: `Initiated by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
                });

            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};
