const Discord = require('discord.js');
const config = require('../config.json');

module.exports = async (client, message) => {
    // if (message.channelId !== config.OCTAVIA_CHANNEL_ID) return

    if (
        message.channel.type === Discord.ChannelType.DM ||
        message.system ||
        message.author.bot
    )
        return;

    if (message.content.toLowerCase().startsWith(config.PREFIX)) {
        if (
            !message.channel
                .permissionsFor(message.guild.members.me)
                .has([
                    'ViewChannel',
                    'SendMessages',
                    'EmbedLinks',
                    'ReadMessageHistory',
                ])
        )
            return;

        const args = message.content.slice(config.PREFIX.length).split(/ +/);
        const cmd = args.shift().toLowerCase();
        const command =
            client.MessageCommands.get(cmd) ||
            client.MessageCommands.find(
                (c) =>
                    c.aliases &&
                    c.aliases.map((a) => a.toLowerCase()).includes(cmd),
            );
        if (command) {
            await message.channel.sendTyping();

            const memberVC = message.member.voice.channel || null;
            const botVC = message.guild.members.me.voice.channel || null;
            const queue = client.distube.getQueue(message.guild) || null;

            if (command.memberVoice) {
                if (!memberVC) {
                    const inVoiceEmbed = new Discord.EmbedBuilder()
                        .setColor(config.ERROR_COLOR)
                        .setDescription(
                            "You aren't connected to any Voice Channel.",
                        )
                        .setFooter({
                            text: `Commanded by ${message.author.tag}`,
                            iconURL: message.author.displayAvatarURL({
                                size: 1024,
                            }),
                        });

                    return await message.reply({ embeds: [inVoiceEmbed] });
                }
            }

            if (command.botVoice) {
                if (!botVC) {
                    const inVoiceEmbed = new Discord.EmbedBuilder()
                        .setColor(config.ERROR_COLOR)
                        .setDescription(
                            "I'm not connected to any Voice Chnanel.",
                        )
                        .setFooter({
                            text: `Commanded by ${message.author.tag}`,
                            iconURL: message.author.displayAvatarURL({
                                size: 1024,
                            }),
                        });

                    return await message.reply({ embeds: [inVoiceEmbed] });
                }
            }

            if (command.sameVoice) {
                if (memberVC && botVC && memberVC.id !== botVC.id) {
                    const inVoiceEmbed = new Discord.EmbedBuilder()
                        .setColor(config.ERROR_COLOR)
                        .setDescription(
                            "You aren't connected to my Voice Channel.",
                        )
                        .setFooter({
                            text: `Commanded by ${message.author.tag}`,
                            iconURL: message.author.displayAvatarURL({
                                size: 1024,
                            }),
                        });

                    return await message.reply({ embeds: [inVoiceEmbed] });
                }
            }

            if (command.queueNeeded) {
                if (!queue) {
                    const noQueueEmbed = new Discord.EmbedBuilder()
                        .setColor(config.ERROR_COLOR)
                        .setDescription("I'm not playing anything right now.")
                        .setFooter({
                            text: `Commanded by ${message.author.tag}`,
                            iconURL: message.author.displayAvatarURL({
                                size: 1024,
                            }),
                        });

                    return await message.reply({ embeds: [noQueueEmbed] });
                }
            }

            try {
                command.execute(
                    client,
                    message,
                    args,
                    cmd,
                    memberVC,
                    botVC,
                    queue,
                );
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
                        iconURL: message.author.displayAvatarURL({
                            size: 1024,
                        }),
                    });

                return await message.reply({ embeds: [errorEmbed] });
            }
        }
    }
};
