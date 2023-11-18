const Discord = require('discord.js');
const config = require('../../config.json');
const axios = require('axios');

module.exports = {
    name: 'Github',
    aliases: ['Git', 'Repo', 'Repos'],
    description: "Displays information about user's github.",
    memberVoice: false,
    botVoice: false,
    sameVoice: false,
    queueNeeded: false,

    async execute(client, message, args) {
        try {
            const username = args[0];

            if (!username) {
                throw new Error('Usage: !github <username>');
            }

            const url = `https://api.github.com/users/${username}`;
            const reposUrl = `${url}/repos?sort=updated&direction=desc`;

            const { data: user } = await axios.get(url);
            const { data: repos } = await axios.get(reposUrl);

            const topRepos = repos
                .slice(0, 3)
                .map(
                    (item, i) =>
                        `**${i + 1}. [${item.name}](${item.html_url})**
                    -**Language:** ${item.language || 'Not specified'}
                    -**Description:** ${
                        item.description || 'No description'
                    }\n\n`,
                )
                .join('');

            const userEmbed = new Discord.EmbedBuilder()
                .setColor(config.MAIN_COLOR)
                .setTitle(`${user.login}'s GitHub Information`)
                .setDescription(`[Open ${user.login}'s Github](${user.url})`)
                .setThumbnail(user.avatar_url)
                .addFields(
                    {
                        name: 'Name',
                        value: user.name || 'Not provided',
                    },
                    {
                        name: 'Bio',
                        value: user.bio || 'Not provided',
                    },
                    {
                        name: 'Followers',
                        value: String(user.followers),
                    },
                    {
                        name: 'Following',
                        value: String(user.following),
                    },
                    {
                        name: 'Public Repositories',
                        value: String(user.public_repos),
                    },
                    {
                        name: 'Latest Repositories',
                        value: topRepos,
                    },
                )
                .setFooter({
                    text: `Commanded by ${message.author.tag}`,
                    iconURL: message.author.displayAvatarURL({ size: 1024 }),
                });

            return await message.channel.send({ embeds: [userEmbed] });
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
