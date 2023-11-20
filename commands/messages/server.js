const Discord = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: 'Server',
    aliases: ['ServerInfo', 'Info'],
    description: 'Display detailed information about the server.',
    memberVoice: false,
    botVoice: false,
    sameVoice: false,
    queueNeeded: false,

    async execute(client, message) {
        try {
            const guild = message.guild;
            const memberCount = String(guild.memberCount);
            const serverName = guild.name;
            const serverCreatedAt = guild.createdAt.toDateString();
            const owner = await client.users.fetch(guild.ownerId);
            const serverOwner = owner ? owner.tag : 'Unknown';
            const roles = guild.roles.cache.map((role) => role.name).join(', ');
            const serverIcon =
                guild.iconURL({ dynamic: true, size: 1024 }) ||
                'No Server Icon';

            const infoEmbed = new Discord.EmbedBuilder()
                .setColor(config.MAIN_COLOR)
                .setTitle('Server Information')
                .setThumbnail(serverIcon)
                .addFields(
                    { name: 'Server Name', value: serverName },
                    { name: 'Member Count', value: memberCount },
                    { name: 'Server Owner', value: serverOwner },
                    { name: 'Server Created At', value: serverCreatedAt },
                    { name: 'Roles', value: roles },
                )
                .setFooter({
                    text: `Commanded by ${message.author.tag}`,
                    iconURL: message.author.displayAvatarURL({ size: 1024 }),
                });

            return message.channel.send({ embeds: [infoEmbed] });
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

            return message.channel.send({ embeds: [errorEmbed] });
        }
    },
};
