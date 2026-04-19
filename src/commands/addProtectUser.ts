import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { client } from "src/start-bot.ts";

export default {
  data: new SlashCommandBuilder()
    .setName("addprotectuser")
    .setDescription("Защити пользователя")
    .addStringOption((option) =>
      option
        .setName("who")
        .setDescription("id пользователя пкм по пользователю и копировать id")
        .setRequired(true),
    ),
  async execute(interaction: CommandInteraction) {
    if (!interaction.isChatInputCommand()) return;
    const who = `${interaction.options.getString("who")!}`;
    await client.writeJSON(who);
    const sent = await interaction.reply({
      content: `Ну типо`,
      withResponse: true,
    });
  },
};
