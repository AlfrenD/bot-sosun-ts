import {
  type ClientOptions,
  Client as DiscordClient,
  Partials,
} from "discord.js";

export class Client extends DiscordClient {
  constructor(options?: ClientOptions) {
    super({
      intents: [
        "Guilds",
        "GuildMessages",
        "GuildMessageReactions",
        "DirectMessages",
        "DirectMessageReactions",
        "MessageContent",
      ] as const,
      partials: [Partials.Channel],
      ...options,
    });
  }
}
