import { Message, OmitPartialGroupDMChannel } from "discord.js";

export async function protUserProcessing(
  message: OmitPartialGroupDMChannel<Message<boolean>>,
) {
  await message.react("🇵");
  await message.react("🇮");
  await message.react("🇩");
  await message.react("🇴");
  await message.react("🇷");
  console.log("работает");
}
