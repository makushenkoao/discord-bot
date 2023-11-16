const Discord = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: 'Bot',
    aliases: ['About', 'Who', 'Author'],
    description: 'Displays information about the bot.',
    memberVoice: false,
    botVoice: false,
    sameVoice: false,
    queueNeeded: false,

    async execute(client, message) {
        try {
            const botInfoEmbed = new Discord.EmbedBuilder()
                .setColor(config.MAIN_COLOR)
                .setTitle('Bot Information')
                .setImage(
                    client.user.displayAvatarURL({ dynamic: true, size: 1024 }),
                )
                .addFields(
                    {
                        name: 'Bot Name',
                        value: client.user.username,
                    },
                    { name: 'Bot ID', value: client.user.id },
                    { name: 'Bot Tag', value: client.user.tag },
                    {
                        name: 'Bot Created At',
                        value: client.user.createdAt.toUTCString(),
                    },
                    {
                        name: 'Developed by',
                        value: `[makushenkoao](https://github.com/makushenkoao)`,
                    },
                )
                .setTimestamp()
                .setDescription(
                    "Type !help or /help to see the bot's commands.",
                )
                .setFooter({
                    text: `Commanded by ${message.author.tag}`,
                    iconURL: message.author.displayAvatarURL({ size: 1024 }),
                });

            return await message.channel.send({ embeds: [botInfoEmbed] });
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
