const Discord = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: 'Warn',
    aliases: [],
    description: 'Warning to user.',
    memberVoice: false,
    botVoice: false,
    sameVoice: false,
    queueNeeded: false,

    execute(client, message, args) {
        try {
            const user = message.mentions.users.first();
            const reason = args.slice(1).join(' ');

            if (!user || !reason) {
                throw new Error('Usage: !warn @user <reason>');
            }

            const warnEmbed = new Discord.EmbedBuilder()
                .setColor(config.WARN_COLOR)
                .setTitle('WARNING!')
                .setDescription(reason)
                .setFooter({
                    text: `Commanded by ${message.author.tag}`,
                    iconURL: message.author.displayAvatarURL({ size: 1024 }),
                });

            user.send({ embeds: [warnEmbed] });

            const infoEmbed = new Discord.EmbedBuilder()
                .setColor(config.MAIN_COLOR)
                .setDescription(
                    `A warning has been issued to the user ${user.username}`,
                )
                .setFooter({
                    text: `Commanded by ${message.author.tag}`,
                    iconURL: message.author.displayAvatarURL({ size: 1024 }),
                });

            return message.channel.send({ embeds: [infoEmbed] });
        } catch (error) {
            const errorEmbed = new Discord.MessageEmbed()
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

            return message.channel.send({ embeds: [errorEmbed] });
        }
    },
};
