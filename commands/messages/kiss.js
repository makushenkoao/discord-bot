const Discord = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: 'Kiss',
    description: 'Kiss a user.',
    memberVoice: false,
    botVoice: false,
    sameVoice: false,
    queueNeeded: false,

    async execute(client, message, args) {
        try {
            const username = args[0];
            const id = username.slice(2, username.length - 1);

            if (message.author.id === id) {
                const invalidAmountEmbed = new Discord.EmbedBuilder()
                    .setColor(config.ERROR_COLOR)
                    .setDescription(
                        `**${message.author.username}**, you can't kiss yourself!`,
                    )
                    .setFooter({
                        text: `Command by ${message.author.tag}`,
                        iconURL: message.author.displayAvatarURL({
                            size: 1024,
                        }),
                    });

                return await message.channel.send({
                    embeds: [invalidAmountEmbed],
                });
            }

            const hugGif =
                'https://media.giphy.com/media/9d3LQ6TdV2Flo8ODTU/giphy.gif';

            const hugEmbed = new Discord.EmbedBuilder()
                .setColor(config.MAIN_COLOR)
                .setDescription(
                    `**${message.author.username}** kissed **${username}** 💋`,
                )
                .setImage(hugGif)
                .setFooter({
                    text: `Commanded by ${message.author.tag}`,
                    iconURL: message.author.displayAvatarURL({ size: 1024 }),
                });

            return await message.channel.send({ embeds: [hugEmbed] });
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
