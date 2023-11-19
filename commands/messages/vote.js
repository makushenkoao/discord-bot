const Discord = require('discord.js');
const config = require('../../config.json');

module.exports = {
    name: 'Vote',
    aliases: ['v'],
    description: 'Starts a vote.',
    memberVoice: false,
    botVoice: false,
    sameVoice: false,
    queueNeeded: false,

    async execute(client, message, args) {
        try {
            const combinedArgs = args.join(' ');
            const [question, optionsString] = combinedArgs.split('?');

            if (!optionsString || !question) {
                throw new Error(
                    'Invalid command format. Please provide a question and options.',
                );
            }

            const options = optionsString
                .split(',')
                .map((option) => option.trim());

            const voteEmbed = new Discord.EmbedBuilder()
                .setColor(config.MAIN_COLOR)
                .setTitle('Vote')
                .setDescription(question)
                .addFields({
                    name: 'Options',
                    value: options
                        .map((option, index) => `${index + 1}. ${option}`)
                        .join('\n'),
                })
                .setFooter({
                    text: `Initiated by ${message.author.tag}`,
                    iconURL: message.author.displayAvatarURL({ size: 1024 }),
                });

            const voteMessage = await message.channel.send({
                embeds: [voteEmbed],
            });

            for (let i = 1; i <= options.length; i++) {
                await voteMessage.react(`${i}\u20e3`);
            }
        } catch (error) {
            const errorEmbed = new Discord.EmbedBuilder()
                .setColor(config.ERROR_COLOR)
                .setDescription(
                    error.message.length > 4096
                        ? error.message.slice(0, 4093) + '...'
                        : error.message,
                )
                .setFooter({
                    text: `Initiated by ${message.author.tag}`,
                    iconURL: message.author.displayAvatarURL({ size: 1024 }),
                });

            await message.channel.send({ embeds: [errorEmbed] });
        }
    },
};
