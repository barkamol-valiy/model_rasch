const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.BOT_TOKEN;

if (!token) {
  console.error(
    "Telegram bot token is not defined. Please check your .env file."
  );
  process.exit(1);
}
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  console.log("Received message:", msg.text);

  // Echo the received message back to the sender
  bot.sendMessage(chatId, `You said: ${msg.text}`);
});

console.log("Bot is running...");

bot.on("polling_error", (error) => {
  console.error("Polling error in ./bot.js:", error);
});
