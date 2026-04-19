import {
  CommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import { client } from "@/start-bot.ts";

export default {
  data: new SlashCommandBuilder()
    .setName("se")
    .setDescription("sendmessage")
    .addStringOption((option) =>
      option.setName("message").setDescription("lox").setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction: CommandInteraction) {
    if (!interaction.isChatInputCommand()) return;

    const message = interaction.options.getString("message")!;
    await client
      .getChannel<TextChannel>(interaction.channelId)
      .send(`${message}`);
  },
};
