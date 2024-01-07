const Discord = require('discord.js');
const config = require('../../config.json');
const axios = require('axios');
const GAME_CATEGORIES = require('../../consts/category');

const MAKUSHENKOAO_ID = '701442165154250762';

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('twitchsettings')
        .setDescription("Displays information about user's github.")
        .addStringOption((option) =>
            option
                .setName('title')
                .setDescription('Description')
                .setRequired(false),
        )
        .addStringOption((option) =>
            option
                .setName('category')
                .setDescription(
                    'Set stream category ==> cs, cs2, dc, fr, wi, gta5, rust, ph, sz, mc',
                )
                .setRequired(false),
        )
        .addStringOption((option) =>
            option
                .setName('tags')
                .setDescription('Set stream tags')
                .setRequired(false),
        ),
    memberVoice: false,
    botVoice: false,
    sameVoice: false,
    queueNeeded: false,

    async execute(client, interaction) {
        await interaction.deferReply();

        if (interaction.user.id !== MAKUSHENKOAO_ID) {
            const botInfoEmbed = new Discord.EmbedBuilder()
                .setColor(config.ERROR_COLOR)
                .setTitle('Error')
                .setDescription('you do not have access to this command')
                .setFooter({
                    text: `Commanded by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
                });

            return await interaction.editReply({ embeds: [botInfoEmbed] });
        }

        try {
            const title = interaction.options.getString('title');
            const tags = interaction.options.getString('tags');
            const shortCategory = interaction.options.getString('category');
            const category = GAME_CATEGORIES.find(
                (cat) => cat.short === shortCategory,
            );

            const payload = {
                broadcaster_id: config.BROADCASTER_ID,
            };

            if (title) {
                payload.title = title;
            }

            if (category) {
                payload.game_id = category.id;
            }

            if (tags) {
                payload.tags = tags.split(' ');
            }

            await axios.patch(`https://api.twitch.tv/helix/channels`, payload, {
                headers: {
                    Authorization: `Bearer ${config.CHANNEL_MANAGE_BROADCAST}`,
                    'Client-Id': config.BOT_CLIENT_ID,
                },
            });

            const userEmbed = new Discord.EmbedBuilder()
                .setColor(config.MAIN_COLOR)
                .setTitle('Update Twitch Information')
                .addFields(
                    {
                        name: 'Title',
                        value: title || 'no changes',
                    },
                    {
                        name: 'Category',
                        value: category?.full || 'no changes',
                    },
                    {
                        name: 'Tags',
                        value: tags || 'no changes',
                    },
                )
                .setFooter({
                    text: `Commanded by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
                });

            await interaction.editReply({ embeds: [userEmbed] });
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
