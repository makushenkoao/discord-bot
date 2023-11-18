const Discord = require('discord.js');
const config = require('../../config.json');
const axios = require('axios');

module.exports = {
    name: 'Define',
    aliases: ['Dictionary', 'DEF'],
    description: 'Find out the meaning of the word.',
    memberVoice: false,
    botVoice: false,
    sameVoice: false,
    queueNeeded: false,

    async execute(client, message, args) {
        try {
            let word = args[0];

            const response = await axios.get(
                `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
            );

            const wordData = response.data[0];

            const wordEmbed = new Discord.EmbedBuilder()
                .setColor(config.MAIN_COLOR)
                .setTitle(`Meaning of the word ${word}`)
                .setFooter({
                    text: `Commanded by ${message.author.tag}`,
                    iconURL: message.author.displayAvatarURL({ size: 1024 }),
                });

            if (wordData.phonetics) {
                for (const phonetic of wordData.phonetics) {
                    const phoneticText = phonetic.text || 'N/A';
                    const phoneticAudio = phonetic.audio || 'N/A';
                    const sourceUrl = phonetic.sourceUrl || 'N/A';

                    wordEmbed.addFields({
                        name: `Phonetics: ${phoneticText}`,
                        value: `[Audio](${phoneticAudio})\n[Source](${sourceUrl})`,
                    });
                }
            }

            if (wordData.meanings) {
                for (const meaning of wordData.meanings) {
                    const partOfSpeech = meaning.partOfSpeech || 'N/A';

                    if (meaning.definitions) {
                        for (const definition of meaning.definitions) {
                            const definitionText =
                                definition.definition || 'N/A';
                            const synonyms = definition.synonyms || ['N/A'];
                            const antonyms = definition.antonyms || ['N/A'];

                            wordEmbed.addFields({
                                name: `Part of Speech: ${partOfSpeech}`,
                                value: `**Definition:** ${definitionText}\n**Synonyms:** ${synonyms.join(
                                    ', ',
                                )}\n**Antonyms:** ${antonyms.join(', ')}`,
                            });
                        }
                    }
                }
            }

            return await message.channel.send({ embeds: [wordEmbed] });
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
