const Discord = require('discord.js');
const config = require('../../config.json');
const { translate } = require('free-translate');

module.exports = {
    name: 'Translate',
    aliases: ['TRSL'],
    description: 'Clears chat messages.',
    memberVoice: false,
    botVoice: false,
    sameVoice: false,
    queueNeeded: false,

    async execute(client, message, args) {
        try {
            const from = args[0];
            const to = args[1];
            const messageForTranslate = args.slice(2, args.length).join(' ');

            if (!from || !to || !messageForTranslate) {
                const isValidArgs = new Discord.EmbedBuilder()
                    .setColor(config.ERROR_COLOR)
                    .setDescription(
                        'Enter text, enter the language you want to translate from and the language you want to translate into.',
                    )
                    .setFooter({
                        text: `Command by ${message.author.tag}`,
                        iconURL: message.author.displayAvatarURL({
                            size: 1024,
                        }),
                    });

                return await message.channel.send({
                    embeds: [isValidArgs],
                });
            }

            const translatedText = await translate(messageForTranslate, {
                from,
                to,
            });

            const translateEmbed = new Discord.EmbedBuilder()
                .setColor(config.MAIN_COLOR)
                .setDescription(`- ${messageForTranslate}\n- ${translatedText}`)
                .setFooter({
                    text: `Commanded by ${message.author.tag}`,
                    iconURL: message.author.displayAvatarURL({ size: 1024 }),
                });

            return await message.channel.send({ embeds: [translateEmbed] });
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
