import { chromium } from "playwright";
import cron from "node-cron";
import { Telegraf } from "telegraf";
import * as dotenv from "dotenv";

dotenv.config();

const telegramToken = process.env.TELEGRAM_TOKEN || "";

if (!telegramToken || telegramToken === "") {
  throw new Error("Please provide a token via environment variables");
}

const bot = new Telegraf(telegramToken);
let chatId = 0;

bot.start((ctx) => {
  chatId = ctx.chat.id;
  ctx.reply("Este bot te avisa si hay figuritas con un mensaje en telegram.");
});

const url =
  "https://www.zonakids.com/productos/pack-x-25-sobres-de-figuritas-fifa-world-cup-qatar-2022/";

cron.schedule("* * * * *", async () => {
  console.log(
    `Running on: ${new Date().toLocaleString("es-AR", {
      timeZone: "America/Buenos_Aires",
    })}`
  );

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const content = await page.inputValue('#product_form input[type="submit"]');

  if (content === "Sin stock") {
    console.log("SIN STOCK");
  } else {
    bot.telegram.sendMessage(
      chatId,
      `
      *HAY FIGURITAS!!*
      Se detectó stock en el pack x25 sobres de Panini.
      Andá a ${url}
    `,
      {
        parse_mode: "MarkdownV2",
      }
    );
  }

  await browser.close();
});

bot.launch();

console.log("bot started!");
