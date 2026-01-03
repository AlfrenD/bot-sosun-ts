import {
  ApplicationCommand,
  ApplicationCommandManager,
  Collection,
  Events,
  REST,
  Routes,
} from "discord.js";

//test import { ButtonBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import { Client } from "./client";
import { constants } from "@/config/constants";

// https://github.com/ZyhlohYT/BasicYTDiscordBot/blob/main/index.js
// https://www.youtube.com/watch?v=Dgy3EJ3HtMw

const client = new Client();

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.log(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});
// test button
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
});
// test end
client.login(constants.client.token);
