const Discord = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: 'Random',
    aliases: ['RNDM', 'RM', 'Rand'],
    description: 'Random integer.',
    memberVoice: false,
    botVoice: false,
    sameVoice: false,
    queueNeeded: false,

    async execute(client, message, args) {
        try {
            const from = parseInt(args[0]) || 1;
            const to = parseInt(args[1]) || 100;

            const randomInt =
                Math.floor(Math.random() * (to - from + 1)) + from;

            const clsEmbed = new Discord.EmbedBuilder()
                .setColor(config.MAIN_COLOR)
                .setDescription(`Random integer - ${randomInt}`)
                .setFooter({
                    text: `Commanded by ${message.author.tag}`,
                    iconURL: message.author.displayAvatarURL({ size: 1024 }),
                });

            return await message.channel.send({ embeds: [clsEmbed] });
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
