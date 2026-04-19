import {
  Collection,
  CommandInteraction,
  Message,
  Options,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";

import fs from "fs";
import * as d3 from "d3";
import d3cloud from "d3-cloud";
import { JSDOM } from "jsdom";

import svg2img from "svg2img";

import { client } from "@/start-bot.ts";

export const createSeededRandom = (seed: string | number) => {
  // Simple hash to turn a string seed into four 32-bit integers
  let str = seed.toString();
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  }

  // Initial state
  let a = h >>> 0;
  let b = h >>> 0;
  let c = h >>> 0;
  let d = h >>> 0;

  return () => {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    let t = (((a + b) | 0) + d) | 0;
    d = (d + 1) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
};

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export default {
  data: new SlashCommandBuilder()
    .setName("cloudwall")
    .setDescription("cloudwall"),
  async execute(interaction: CommandInteraction) {
    const channel = client.getChannel<TextChannel>(interaction.channelId);

    if (!interaction.isChatInputCommand()) return;
    await interaction.deferReply();
    let messageContentArray: string[] = [];
    let lastMessageId: string | undefined | null = undefined;

    while (lastMessageId !== null && messageContentArray.length < 500) {
      const chunk: Collection<string, Message<true>> = await client
        .getChannel<TextChannel>(interaction.channelId)
        .messages.fetch({ limit: 100, before: lastMessageId });
      messageContentArray.push(...chunk.map((message) => message.cleanContent));
      lastMessageId = chunk.size > 0 ? chunk.at(chunk.size - 1)!.id : null;
    }
    messageContentArray = messageContentArray.concat(messageContentArray);
    messageContentArray = messageContentArray.filter(
      (str) => str.trim() !== "",
    );

    const wordCount: Record<string, number> = {};
    let [min, max] = [Infinity, -Infinity];

    messageContentArray.forEach((msg) => {
      for (const _word of msg.split(" ")) {
        const word = _word.toLowerCase();
        if (word.length > 40) {
          continue;
        }
        const count = (wordCount[word] || 0) + 1;
        wordCount[word] = count;
        if (count > max) max = count;
        if (count < min) min = count;
      }
    });

    const getFontSize = (count: number) => {
      const percent = (count - min) / (max - min);
      return (24 - 12) * percent + 12;
    };
    const words = Object.entries(wordCount).map(([key, value]) => ({
      text: key,
      size: value,
    }));

    const [width, height] = [1600, 1000];
    const [marginTop, marginLeft, marginRight, marginBottom] = [1, 1, 1, 1];
    const fontFamily = "sans-serif";
    const fontScale = 10;
    const fill = null;

    const document = new JSDOM(`<body></body>`).window.document;
    global.document = document; //TODO: РЕФАКТОРИНГ ОТ АРТЁМА: ПЕРЕОБЪЯВИТЬ ТИП GLOBAL.DOCUMENT, СОЗДАТЬ АСИНХРОННУЮ ОБЁРТКУ 'END'

    d3.select(document.body)
      .append("svg")
      //.attr("class", "ui fluid image")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", `${width}`)
      .attr("height", `${height}`)
      .attr("font-family", fontFamily)
      .attr("style", "max-width: 100%; height: auto; height: intrinsic")
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .append("g")
      .attr("transform", `translate(${marginLeft}, ${marginTop})`);

    const g = document.querySelector("g")!;

    const cloud = d3cloud()
      .random(createSeededRandom("Пидарасик"))
      .size([
        width - marginLeft - marginRight,
        height - marginTop - marginBottom,
      ])
      .words(words)
      .padding(10)
      .rotate(Math.floor(Math.random() * 2) * 90)
      .font(fontFamily)
      .fontSize((d) => Math.sqrt(d.size!) * fontScale)
      //.fontSize(60)
      .on("word", ({ size, x, y, rotate, text }) => {
        const wordTag = document.createElement("text");
        wordTag.textContent = text || "";
        wordTag.setAttribute("font-size", `${size}`);
        wordTag.setAttribute("fill", `${getRandomColor()}`);
        wordTag.setAttribute(
          "transform",
          `translate(${x},${y}) rotate(${rotate})`, //TODO: подрочить параметры https://codesandbox.io/p/sandbox/d3js-fom3l?file=%2Fsrc%2Findex.js%3A97%2C22
        );
        wordTag.setAttribute("color", `${getRandomColor()}`);
        g.append(wordTag);
      })
      .on("end", async () => {
        const svgDermo = document.querySelector("svg")!.outerHTML;
        fs.writeFileSync("govno.svg", svgDermo);
        svg2img(svgDermo, function (err, buffer) {
          if (err) {
            console.error("Conversion error:", err);
            console.error("Error message:", err.message);
            console.error("Full error:", JSON.stringify(err, null, 2));
          } else {
            console.log("Buffer size:", buffer.length);
            console.log("Buffer:", buffer.toString("base64").substring(0, 50));
            fs.writeFileSync("cloudwall.png", buffer);
          }
        });

        await interaction.editReply({
          files: [{ attachment: "cloudwall.png" }],
        });
      })
      .start();
  },
};
