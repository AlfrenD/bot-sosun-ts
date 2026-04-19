import {
  ActionRowBuilder,
  ButtonBuilder,
  CommandInteraction,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import * as chrono from "chrono-node";
import schedule from "node-schedule";
import { client } from "src/start-bot.ts";
const rows: ActionRowBuilder<ButtonBuilder>[] = [];
export default {
  data: new SlashCommandBuilder()
    .setName("remind")
    .setDescription("reminder...")
    .addStringOption((option) =>
      option.setName("when").setDescription("когда").setRequired(true),
    )
    .addStringOption(
      (option) =>
        option.setName("what").setDescription("что").setRequired(true), //TODO сделать хуйню на каждую
    ),

  async execute(interaction: CommandInteraction) {
    if (!interaction.isChatInputCommand()) return;

    const when = interaction.options.getString("when")!;
    const what = interaction.options.getString("what") || "ты говно";
    const parsedDate = chrono.ru.parseDate(when, undefined, {
      forwardDate: true,
    });
    const sent = await interaction.reply({
      content: `${parsedDate}`,
      withResponse: true,
    });
    let userid = interaction.user.id;
    const alarm = schedule.scheduleJob(parsedDate, async () => {
      await client
        .getChannel<TextChannel>(interaction.channelId)
        .send(`< ${userid}гомосек просил напомнить, что ${what} в ${when} `);
    });
  },
};
