import {
  ApplicationCommand,
  ApplicationCommandManager,
  Collection,
  Events,
  REST,
  Routes,
} from "discord.js";

import fs from "fs";
import path, { dirname } from "path";
//test import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import { Client } from "./client";
import { constants } from "@/config/constants";
import { fileURLToPath } from "url";

// https://github.com/ZyhlohYT/BasicYTDiscordBot/blob/main/index.js
// https://www.youtube.com/watch?v=Dgy3EJ3HtMw

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const deployCommands = async () => {
  try {
    const arrCommands = [];

    const commandFiles = fs
      .readdirSync(path.join(__dirname, "commands"))
      .filter((file) => file.endsWith(".ts"));

    for (const file of commandFiles) {
      const command = await import(`./commands/${file}`);
      if ("data" in command && "execute" in command) {
        arrCommands.push(command);
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

const client = new Client();

// test button
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
});
// test end
client.login(constants.client.token);
