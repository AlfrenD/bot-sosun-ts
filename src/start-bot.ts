import {
  ApplicationCommand,
  ApplicationCommandManager,
  Collection,
  Events,
  REST,
  Routes,
  TextChannel,
} from "discord.js";
import schedule from "node-schedule";

import { Client } from "./client";
import { constants } from "@/config/constants";
import { protUserProcessing } from "@/utils/ProtectUser.ts";
import { autoMod } from "@/utils/autoMod.ts";

// https://github.com/ZyhlohYT/BasicYTDiscordBot/blob/main/index.js
// https://www.youtube.com/watch?v=Dgy3EJ3HtMw

export const client = new Client();

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

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  //message resolver
  const MiscJson = await client.readJSON();
  autoMod(message, MiscJson);
  if (MiscJson.protectedUsers.includes(message.author.id)) {
    //protUserProcessing(message);
  }
});

client.on(Events.TypingStart, async (typing) => {
  //const { channel, user } = typing;
  // const listOfProtectedUsers = await client.readJSON();
  // channel.typin;
  // if (listOfProtectedUsers.includes(user.id)) {
  //   setTimeout(async () => {
  //     console.log(`${user.id} in typing in ${channel.id}`); //TODO Для дурилки надо будет сделать ГОВНО НЕЛЬЗЯ СДЕЛАТЬ ПО НОЛРМАЛЬНОМУ
  //     const messageSand = await client
  //       .getChannel<TextChannel>(channel.id)
  //       .send(`пидарас ${user.username} печатает`);
  //   }, 5000);
  // }
});

client.login(constants.client.token);
