const Discord = require('discord.js');
const config = require('../../config.json');
const axios = require('axios');

module.exports = {
    data: new Discord.SlashCommandBuilder()
        .setName('weather')
        .setDescription('Check the weather.')
        .addStringOption((option) =>
            option
                .setName('city')
                .setDescription('city where you want to know the weather')
                .setRequired(true),
        ),
    memberVoice: false,
    botVoice: false,
    sameVoice: false,
    queueNeeded: false,

    async execute(client, interaction) {
        await interaction.deferReply();

        try {
            const city = interaction.options.getString('city');

            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${config.WEATHER_API_KEY}`,
            );

            const weatherEmbed = new Discord.EmbedBuilder()
                .setColor(config.MAIN_COLOR)
                .setTitle(
                    `Weather in ${response.data.name}, ${response.data.sys.country}`,
                )
                .addFields(
                    {
                        name: 'Temperature :thermometer:',
                        value: `${Math.floor(
                            response.data.main.temp - 273.15,
                        )}°C`,
                    },
                    {
                        name: 'Weather :sunny:',
                        value: response.data.weather[0].description,
                    },
                    {
                        name: 'Humidity :bubbles:',
                        value: `${response.data.main.humidity}%`,
                    },
                    {
                        name: 'Wind Speed :wind_blowing_face:',
                        value: `${response.data.wind.speed} m/s`,
                    },
                    {
                        name: 'Visibility :fog:',
                        value: `${response.data.visibility} meters`,
                    },
                )
                .setFooter({
                    text: `Commanded by ${interaction.user.tag}`,
                    iconURL: interaction.user.displayAvatarURL({ size: 1024 }),
                });

            return await interaction.editReply({ embeds: [weatherEmbed] });
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
