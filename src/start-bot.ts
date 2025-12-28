import { Events } from "discord.js";

import { Client } from "./client";
import { constants } from "@/config/constants";

const client = new Client();

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}!`);
  readyClient.user.setActivity("Я сосу я сосу я сосу влажно");
});

client.login(constants.client.token);
