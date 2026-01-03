import {
  CommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";

export default {
  data: new SlashCommandBuilder().setName("ping").setDescription("Ping..."),
  async execute(interaction: CommandInteraction) {
    const sent = await interaction.reply({
      content: "Пидарас ты хуесосина соси хуй пизда ты старый хуй да да я",
      flags: MessageFlags.Ephemeral,
      withResponse: true,
    });
    console.log(sent.resource?.message);
  },
};
