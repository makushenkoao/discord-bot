const Discord = require('discord.js');
const config = require('../../config.json');

module.exports = {
  name: "PlaySkip",
  aliases: ["PS"],
  description: "Plays the song and skips current song.",
  memberVoice: true,
  botVoice: false,
  sameVoice: true,
  queueNeeded: false,

  async execute(client, message, args, cmd, memberVC, botVC, queue) {
    const string = args.join(" ");
    if (!string) {
      const stringEmbed = new Discord.EmbedBuilder()
        .setColor(config.ERROR_COLOR)
        .setDescription("Please enter a song url or query to search.")
        .setFooter({
          text: `Commanded by ${message.author.tag}`,
          iconURL: message.author.displayAvatarURL({ size: 1024 }),
        });

      return await message.reply({ embeds: [stringEmbed] });
    }

    try {
      await client.distube.play(memberVC, string, {
        member: message.member,
        textChannel: message.channel,
        message,
        skip: true,
      });
    } catch (error) {
      const errorEmbed = new Discord.EmbedBuilder()
        .setColor(config.ERROR_COLOR)
        .setDescription(
          error.message.length > 4096
            ? error.message.slice(0, 4093) + "..."
            : error.message,
        )
        .setFooter({
          text: `Commanded by ${message.author.tag}`,
          iconURL: message.author.displayAvatarURL({ size: 1024 }),
        });

      return await message.reply({ embeds: [errorEmbed] });
    }
  },
};