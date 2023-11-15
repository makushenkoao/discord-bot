const Discord = require('discord.js');
const config = require('../../config.json');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('help')
        .setDescription("Shows the Bot's commands list and information."),
    memberVoice: false,
    botVoice: false,
    sameVoice: false,
    queueNeeded: false,

    async execute(client, interaction) {
        await interaction.deferReply();

        const helpEmbed = new Discord.EmbedBuilder()
            .setColor(config.MAIN_COLOR)
            .setAuthor({
                name: `${client.user.username} Commands`,
                iconURL: client.user.displayAvatarURL({ size: 1024 }),
            })
            .setDescription(
                client.MessageCommands.map(
                    (c) =>
                        `> \`${config.PREFIX}${c.name}\` \`(${
                            c.aliases
                                ?.map((a) => `${config.PREFIX}${a}`)
                                ?.join(' / ') || 'No Aliases'
                        })\`\n> *${c.description}*`,
                ).join('\n\n'),
            )
            .setFooter({
                text: 'Developed by @popcorn',
            });

        return await interaction.editReply({ embeds: [helpEmbed] });
    },
};
