import {
  ActionRowBuilder,
  ButtonBuilder,
  CommandInteraction,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { client } from "src/start-bot.ts";

client.on("messageCreate", async (message) => {
  console.log("работает");
});
