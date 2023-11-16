const Discord = require('discord.js');
const axios = require('axios');
const config = require('../../config.json');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('getusersteam')
        .setDescription('Get information about user in steam.')
        .addStringOption((option) =>
            option
                .setName('id')
                .setDescription('User steam id')
                .setRequired(true),
        ),
    memberVoice: false,
    botVoice: false,
    sameVoice: false,
    queueNeeded: false,

    async execute(client, interaction) {
        await interaction.deferReply();

        try {
            const steamId = interaction.options.getString('id');

            const response = await axios.get(
                `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${config.STEAM_API_KEY}&steamids=${steamId}`,
            );

            if (response?.data?.players?.length === 0) {
                const invalidIdEmbed = new Discord.EmbedBuilder()
                    .setColor(config.ERROR_COLOR)
                    .setDescription('User not found!')
                    .setFooter({
                        text: `Command by ${interaction.user.tag}`,
                        iconURL: interaction.user.displayAvatarURL({
                            size: 1024,
                        }),
                    });

                return await interaction.editReply({
                    embeds: [invalidIdEmbed],
                });
            }

            const playerData = response.data.response.players[0];

            const steamProfileEmbed = new Discord.EmbedBuilder()
                .setColor(config.MAIN_COLOR)
                .setAuthor({
                    iconURL: playerData?.avatarfull,
                    name: playerData?.personaname,
                })
                .setTitle('Steam Profile Information')
                .addFields(
                    {
                        name: 'Steam ID',
                        value: playerData.steamid,
                        inline: true,
                    },
                    {
                        name: 'Profile URL',
                        value: playerData.profileurl,
                        inline: true,
                    },
                    {
                        name: 'Status',
                        value:
                            playerData.personastate === 0
                                ? 'Offline'
                                : 'Online',
                        inline: true,
                    },
                    {
                        name: 'Game',
                        value: playerData.gameextrainfo || 'Not in game',
                        inline: true,
                    },
                    {
                        name: 'Country',
                        value: playerData.loccountrycode || 'Unknown',
                        inline: true,
                    },
                )
                .setThumbnail(playerData.avatarfull)
                .setFooter({
                    text: `Commanded by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
                });

            await interaction.editReply({ embeds: [steamProfileEmbed] });
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
