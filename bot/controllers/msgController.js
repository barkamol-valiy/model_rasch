const xls = require("../parsers/xls");
const csv = require("../parsers/csv");

const handleCommand = (bot, chatId, command) => {
  switch (command) {
    case "/start":
      bot.sendMessage(
        chatId,
        "Xush kelibsiz! Iltimos faylni yuboring. Yordam uchun /help ni yuboring"
      );
      break;
    case "/help":
      bot.sendMessage(chatId, "Bot .xlsx va .csv fayllarni o'qiy oladi");
      break;
    default:
      bot.sendMessage(chatId, "Noma'lum buyruq");
  }
};

const handleTxtMessage = (bot, chatId, message) => {
  bot.sendMessage(chatId, "Iltimos faylni yuboring");
  console.log(`Received a message from ${chatId}: ${message}`);
};

const handleDocument = async (bot, chatId, document) => {
  const fileId = document.file_id;
  const fileName = document.file_name;

  if (
    fileName.endsWith(".xlsx") ||
    fileName.endsWith(".csv") ||
    fileName.endsWith(".xls")
  ) {
    try {
      if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
        await xls.handleXLS(bot, chatId, fileId, fileName);
      } else if (fileName.endsWith(".csv")) {
        await csv.handleCSV(bot, chatId, fileId, fileName);
      }
    } catch (error) {
      console.error("Error handling document:", error.message);
      bot.sendMessage(chatId, "Failed to handle the document.");
    }
  } else {
    bot.sendMessage(chatId, "Faqat .xlsx, .xls va .csv fayllarni yuboring");
  }
  console.log(`Received a document from ${chatId}: ${fileName}`);
};

module.exports = { handleCommand, handleTxtMessage, handleDocument };
