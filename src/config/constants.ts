import { config as initENV } from "dotenv";

initENV();

export const constants = {
  src: {
    funnyCat:
      "https://media.discordapp.net/attachments/1382125841286430810/1460684383068356699/bzzz.gif?ex=6976f917&is=6975a797&hm=eb2047e981150222b613ff1e1dedc367c4a423aaabf1b63595f26171d781e299&=",
  },
  client: {
    prefix: "@Test node.js bot",
    id: "1406180906615701618",
    token: `${process.env.DISCORD_BOT_TOKEN}`,
    intents: [
      "Guilds",
      "GuildMessages",
      "GuildMessageReactions",
      "DirectMessages",
      "DirectMessageReactions",
      "MessageContent",
    ],
    partials: ["Message", "Channel", "Reaction"],
    caches: {
      AutoModerationRuleManager: 0,
      BaseGuildEmojiManager: 0,
      GuildEmojiManager: 0,
      GuildBanManager: 0,
      GuildInviteManager: 0,
      GuildScheduledEventManager: 0,
      GuildStickerManager: 0,
      MessageManager: 0,
      PresenceManager: 0,
      StageInstanceManager: 0,
      ThreadManager: 0,
      ThreadMemberManager: 0,
      VoiceStateManager: 0,
    },
  },
};
