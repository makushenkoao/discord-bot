const Discord = require('discord.js');
const config = require('../../config.json');
const axios = require('axios');

module.exports = {
    name: 'GetUserSteam',
    aliases: ['Steam', 'GUS'],
    description: 'Get information about user in steam.',
    memberVoice: false,
    botVoice: false,
    sameVoice: false,
    queueNeeded: false,

    async execute(client, message, args) {
        try {
            const steamId = args[0];

            const response = await axios.get(
                `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${config.STEAM_API_KEY}&steamids=${steamId}`,
            );

            if (response?.data?.players?.length === 0) {
                const invalidIdEmbed = new Discord.EmbedBuilder()
                    .setColor(config.ERROR_COLOR)
                    .setDescription('User not found!')
                    .setFooter({
                        text: `Command by ${message.author.tag}`,
                        iconURL: message.author.displayAvatarURL({
                            size: 1024,
                        }),
                    });

                return await message.channel.send({
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
                    text: `Command by ${message.author.tag}`,
                    iconURL: message.author.displayAvatarURL({
                        size: 1024,
                    }),
                });

            return await message.channel.send({ embeds: [steamProfileEmbed] });
        } catch (error) {
            const errorEmbed = new Discord.EmbedBuilder()
                .setColor(config.ERROR_COLOR)
                .setDescription(
                    error.message.length > 4096
                        ? error.message.slice(0, 4093) + '...'
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
