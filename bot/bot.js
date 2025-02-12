const TelegramBot = require("node-telegram-bot-api");
const msgHandler = require("./handlers/msgHandler");
require("dotenv").config();

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.BOT_TOKEN;

if (!token) {
  console.error(
    "Telegram bot token is not defined. Please check your .env file."
  );
  process.exit(1);
}
const bot = new TelegramBot(token, { polling: true });

bot.on("message", msgHandler.MessageHandler(bot));
bot.on("document", msgHandler.DocumentHandler(bot));

console.log("Bot is running...");

bot.on("polling_error", (error) => {
  console.error("Polling error in ./bot.js:", error);
});
