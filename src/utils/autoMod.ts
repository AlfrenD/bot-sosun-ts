import { Message, OmitPartialGroupDMChannel } from "discord.js";
import { JsonDataStructure } from "@/client.ts";

export async function autoMod(
  message: OmitPartialGroupDMChannel<Message<boolean>>,
  MiscJson: JsonDataStructure,
) {
  const regex = new RegExp(
    `(?<![\\p{L}\\p{N}])(${MiscJson.banWords.join("|")})(?![\\p{L}\\p{N}])`,
    "giu",
  );
  const matches = message.content.toLowerCase().match(regex);
  let censoredMessage = message.content;
  censoredMessage = censoredMessage.replace(regex, (match) => `~~${match}~~`);
  if (matches) {
    await message.reply("Исправь!");
    const dmRule = "Твоё сообщение содержит К слово, можно заменить";
    await message.author.send(dmRule + "\nСообщение:\n> " + censoredMessage);
    await message.delete();
  }
}
