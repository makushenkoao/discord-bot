const Discord = require('discord.js');
const config = require('../../config.json');
const parseTime = require('../../utils/parseTime');
const formatTime = require('../../utils/formatTime');

const reminders = new Map();

module.exports = {
    name: 'Reminder',
    aliases: ['RMNDR'],
    description: 'Clears chat messages.',
    memberVoice: false,
    botVoice: false,
    sameVoice: false,
    queueNeeded: false,

    async execute(client, message, args) {
        try {
            const reminderMessage = args[0];
            const timeString = args[1];
            const time = parseTime(timeString);

            if (isNaN(time)) {
                throw new Error(
                    'Invalid time format. Please use a valid format like 1h30m.',
                );
            }

            const user = await client.users.fetch(message.author.id);
            const reminderEmbed = new Discord.EmbedBuilder()
                .setColor(config.WARN_COLOR)
                .setDescription(`Reminder: ${reminderMessage}`)
                .setFooter({
                    text: `Command by ${message.author.tag}`,
                    iconURL: message.author.displayAvatarURL({
                        size: 1024,
                    }),
                });

            reminders.set(user.id, {
                message: reminderMessage,
                time,
                timeout: setTimeout(() => {
                    user.send({ embeds: [reminderEmbed] });
                    reminders.delete(user.id);
                }, time),
            });

            const successEmbed = new Discord.EmbedBuilder()
                .setColor(config.MAIN_COLOR)
                .setDescription(`Reminder set for ${formatTime(time / 1000)}.`)
                .setFooter({
                    text: `Command by ${message.author.tag}`,
                    iconURL: message.author.displayAvatarURL({
                        size: 1024,
                    }),
                });

            return await message.channel.send({ embeds: [successEmbed] });
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
