const Discord = require("discord.js");
const config = require("../config.json");

module.exports = async (client) => {
  await client.user.setPresence({
    activities: [
      {
        name: `to ${config.PREFIX}Play`,
        type: Discord.ActivityType.Listening,
      },
    ],
    status: "online",
  });

  console.log(`${client.user.tag} is online and ready to play music for you!`);
};
