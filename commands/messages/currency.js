const Discord = require('discord.js');
const config = require('../../config.json');
const axios = require('axios');

module.exports = {
    name: 'Currency',
    aliases: ['Exchange', 'Convert'],
    description: 'Clears chat messages.',
    memberVoice: false,
    botVoice: false,
    sameVoice: false,
    queueNeeded: false,

    async execute(client, message, args) {
        try {
            const from = args[0];
            const to = args[1];
            const amount = args[2];

            if (!from || !to || !amount) {
                throw new Error(
                    'Usage: !currency <From convert> <To convert> <Amount>',
                );
            }

            const response = await axios.get(
                `https://api.api-ninjas.com/v1/convertcurrency?have=${from}&want=${to}&amount=${amount}`,
                {
                    headers: {
                        'X-Api-Key': config.CONVERT_API_KEY,
                    },
                },
            );

            const convertEmbed = new Discord.EmbedBuilder()
                .setColor(config.MAIN_COLOR)
                .setTitle('Currency conversion')
                .setDescription(
                    `${response.data.old_amount} ${response.data.old_currency}\n${response.data.new_amount} ${response.data.new_currency}`,
                )
                .setFooter({
                    text: `Commanded by ${message.author.tag}`,
                    iconURL: message.author.displayAvatarURL({ size: 1024 }),
                });

            return await message.channel.send({ embeds: [convertEmbed] });
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
