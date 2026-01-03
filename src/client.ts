import {
  Client as DiscordClient,
  type ClientOptions,
  Collection,
  Events,
  Interaction,
  Partials,
  REST,
  Routes,
  SlashCommandBuilder,
} from "discord.js";

import fs from "fs";
import path from "path";
import { constants } from "@/config/constants.ts";
interface CommandConfig {
  data: SlashCommandBuilder;
  execute: (interaction: Interaction) => Promise<void>;
}
const dirname = import.meta.dirname;
export class Client extends DiscordClient {
  commands = new Collection<string, CommandConfig>();
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
      partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
      ],
      ...options,
    });
    this.once(Events.ClientReady, async (readyClient) => {
      console.log(`Ready! Logged in as ${readyClient.user.tag}!`);
      await this.#deployCommands();
      console.log("Commands deployed globally");
      readyClient.user.setActivity("Я сосу я сосу я сосу влажно");
    });
  }
  #deployCommands = async () => {
    try {
      const arrCommands = [];

      const commandFiles = fs
        .readdirSync(path.join(dirname, "commands"))
        .filter((file) => file.endsWith(".ts"));

      for (const file of commandFiles) {
        const command: CommandConfig = (await import(`./commands/${file}`))
          .default;
        if ("data" in command && "execute" in command) {
          arrCommands.push(command.data.toJSON());
          this.commands.set(command.data.name, command);
        } else {
          console.log(
            `WARNONG: The command ${file} is missing a required 'data' or 'execute'`,
          );
        }
      }
      const rest = new REST().setToken(constants.client.token); //TODO прочитай про discord REST

      console.log(`Started refreshing application slash commands globally.`);

      const data = await rest.put(
        Routes.applicationCommands(constants.client.id),
        { body: arrCommands },
      );

      console.log(`Successfully reloaded all commands`);
    } catch (err) {
      console.error(err);
    }
  };
}
