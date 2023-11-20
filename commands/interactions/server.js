const Discord = require('discord.js');
const config = require('../../config.json');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('server')
        .setDescription('Display detailed information about the server.'),

    async execute(client, interaction) {
        await interaction.deferReply();

        try {
            const guild = interaction.guild;
            const memberCount = String(guild.memberCount);
            const serverName = guild.name;
            const serverCreatedAt = guild.createdAt.toDateString();
            const owner = await client.users.fetch(guild.ownerId);
            const serverOwner = owner ? owner.tag : 'Unknown';
            const roles = guild.roles.cache.map((role) => role.name).join(', ');
            const verificationLevel = String(guild.verificationLevel);
            const serverIcon = guild.iconURL({ dynamic: true, size: 1024 }) || 'No Server Icon';

            const infoEmbed = new Discord.EmbedBuilder()
                .setColor(config.MAIN_COLOR)
                .setTitle('Server Information')
                .setThumbnail(serverIcon)
                .addFields(
                    { name: 'Server Name', value: serverName },
                    { name: 'Member Count', value: memberCount },
                    { name: 'Server Owner', value: serverOwner },
                    { name: 'Server Created At', value: serverCreatedAt },
                    { name: 'Verification Level', value: verificationLevel },
                    { name: 'Roles', value: roles },
                )
                .setFooter({
                    text: `Commanded by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
                });

            return await interaction.editReply({ embeds: [infoEmbed] });
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

            await interaction.editReply({ embeds: [errorEmbed] });
        }
    },
};
