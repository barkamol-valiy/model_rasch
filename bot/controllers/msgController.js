const handleCommand = (bot, chatId, command) => {
  switch (command) {
    case "/start":
      bot.sendMessage(
        chatId,
        "Xush kelibsiz! Iltimos faylni yuboring. Yordam uchun /help ni yuboring"
      );
      break;
    case "/help":
      bot.sendMessage(chatId, "Bot .xlsx va .csv fayllarni o'qiy oladi ");
      break;
    default:
      bot.sendMessage(chatId, "Noma'lum buyruq");
  }
};

const handleTxtMessage = (bot, chatId, message) => {
  bot.sendMessage(chatId, "Iltimos faylni yuboring");
  console.log(`Received a message from ${chatId}: ${message}`);
};
const handleDocument = (bot, chatId, document) => {
  if (
    document.file_name.endsWith(".xlsx") ||
    document.file_name.endsWith(".csv") ||
    document.file_name.endsWith(".xls")
  ) {
    bot.sendMessage(chatId, "Fayl qabul qilindi. Iltimos kuting...");
  } else {
    bot.sendMessage(chatId, "Faqat .xlsx, xls va .csv fayllarni yuboring");
  }
  console.log(`Received a document from ${chatId}: ${document}`);
};

module.exports = { handleCommand, handleTxtMessage, handleDocument };
