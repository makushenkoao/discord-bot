const Discord = require('discord.js');
const config = require('../../config.json');
const axios = require('axios');

module.exports = {
    name: 'CountryInfo',
    aliases: ['Country', 'Nation'],
    description: 'Info about country.',
    memberVoice: false,
    botVoice: false,
    sameVoice: false,
    queueNeeded: false,

    async execute(client, message, args) {
        try {
            let country = args[0];

            if (!country) {
                throw new Error('Usage: !country <contry>');
            }

            const response = await axios.get(
                `https://restcountries.com/v3.1/name/${country}`,
            );

            const countryData = response.data[0];

            const languagesArray = Object.entries(
                countryData.languages || {},
            ).map(([code, name]) => `${code}: ${name}`);

            const countryEmbed = new Discord.EmbedBuilder()
                .setColor(config.MAIN_COLOR)
                .setTitle(`Information about ${country}`)
                .setThumbnail(countryData?.flags?.png)
                .addFields(
                    { name: 'Name', value: countryData.name.common },
                    { name: 'Capital', value: countryData.capital[0] || 'N/A' },
                    {
                        name: 'Population',
                        value: String(countryData.population) || 'N/A',
                    },
                    { name: 'Region', value: countryData.region || 'N/A' },
                    {
                        name: 'Subregion',
                        value: countryData.subregion || 'N/A',
                    },
                    {
                        name: 'Languages',
                        value:
                            languagesArray.length > 0
                                ? languagesArray.join('\n')
                                : 'N/A',
                    },
                )
                .setFooter({
                    text: `Commanded by ${message.author.tag}`,
                    iconURL: message.author.displayAvatarURL({ size: 1024 }),
                });

            return await message.channel.send({ embeds: [countryEmbed] });
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
