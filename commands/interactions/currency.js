const Discord = require('discord.js');
const config = require('../../config.json');
const axios = require('axios');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('currency')
        .setDescription('Currency conversion.')
        .addStringOption((option) =>
            option
                .setName('from')
                .setDescription('From currency. For example: usd')
                .setRequired(true),
        )
        .addStringOption((option) =>
            option
                .setName('to')
                .setDescription('To currency. For example: eur')
                .setRequired(true),
        )
        .addIntegerOption((option) =>
            option
                .setName('amount')
                .setDescription('Amount for convert')
                .setRequired(true),
        ),
    memberVoice: false,
    botVoice: false,
    sameVoice: false,
    queueNeeded: false,

    async execute(client, interaction) {
        await interaction.deferReply();

        try {
            const from = interaction.options.getString('from').toLowerCase();
            const to = interaction.options.getString('to').toLowerCase();
            const amount = interaction.options.getInteger('amount');

            const response = await axios.get(
                `https://api.api-ninjas.com/v1/convertcurrency?have=${from}&want=${to}&amount=${amount}`,
                {
                    headers: {
                        'X-Api-Key': config.CONVERT_API_KEY,
                    },
                },
            );

            const convertEmbed = new Discord.EmbedBuilder()
                .setColor(config.MAIN_COLOR)
                .setTitle('Currency conversion')
                .setDescription(
                    `${response.data.old_amount} ${response.data.old_currency}\n${response.data.new_amount} ${response.data.new_currency}`,
                )
                .setFooter({
                    text: `Commanded by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
                });

            await interaction.editReply({ embeds: [convertEmbed] });
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
