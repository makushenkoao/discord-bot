const Discord = require("discord.js");
const config = require("../../config.json");

module.exports = {
  name: "Help",
  aliases: ["H", "CMD", "CMDs", "Command", "Commands"],
  description: "Shows This!",
  memberVoice: false,
  botVoice: false,
  sameVoice: false,
  queueNeeded: false,

  async execute(client, message) {
    const helpEmbed = new Discord.EmbedBuilder()
      .setColor(config.MAIN_COLOR)
      .setAuthor({
        name: `${client.user.username} Commands`,
        iconURL: client.user.displayAvatarURL({ size: 1024 }),
      })
      .setDescription(
        client.MessageCommands.map(
          (c) =>
            `> \`${config.PREFIX}${c.name}\` \`(${
              c.aliases?.map((a) => `${config.PREFIX}${a}`)?.join(" / ") ||
              "No Aliases"
            })\`\n> *${c.description}*`,
        ).join("\n\n"),
      )
      .setFooter({
        text: "Developed by iTz Arshia#7650 https://github.com/iTzArshia/iTz-DJ",
      });

    return await message.reply({ embeds: [helpEmbed] });
  },
};
