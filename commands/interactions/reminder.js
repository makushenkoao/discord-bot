const Discord = require('discord.js');
const config = require('../../config.json');
const parseTime = require('../../utils/parseTime');
const formatTime = require('../../utils/formatTime');

const reminders = new Map();

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('reminder')
        .setDescription('Set a reminder.')
        .addStringOption((option) =>
            option
                .setName('message')
                .setDescription('Reminder message')
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName('time')
                .setDescription('Time for the reminder (e.g., 1h30m)')
                .setRequired(true),
        ),

    async execute(client, interaction) {
        await interaction.deferReply();

        try {
            const message = interaction.options.getString('message');
            const timeString = interaction.options.getString('time');
            const time = parseTime(timeString);

            if (isNaN(time)) {
                throw new Error(
                    'Invalid time format. Please use a valid format like 1h30m.',
                );
            }

            const reminderEmbed = new Discord.EmbedBuilder()
                .setColor(config.WARN_COLOR)
                .setDescription(`Reminder: ${message}`)
                .setFooter({
                    text: `Commanded by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
                });

            reminders.set(interaction.user.id, {
                message,
                time,
                timeout: setTimeout(() => {
                    interaction.user.send({ embeds: [reminderEmbed] });
                    reminders.delete(interaction.user.id);
                }, time),
            });

            const successEmbed = new Discord.EmbedBuilder()
                .setColor(config.MAIN_COLOR)
                .setDescription(`Reminder set for ${formatTime(time / 1000)}.`)
                .setFooter({
                    text: `Commanded by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
                });

            return await interaction.editReply({ embeds: [successEmbed] });
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
