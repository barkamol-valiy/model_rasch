const msgController = require("../controllers/msgController");

const MessageHandler = (bot) => (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;

  console.log(`Received a message from ${chatId}: ${messageText}`);

  if (messageText) {
    if (messageText.startsWith("/")) {
      msgController.handleCommand(bot, chatId, messageText);
    } else {
      msgController.handleTxtMessage(bot, chatId, messageText);
    }
  } else {
    // Handle non-text messages if needed
    console.log(`Non-text message received from ${chatId}`);
  }
};

const DocumentHandler = (bot) => (msg) => {
  const chatId = msg.chat.id;
  const document = msg.document;

  console.log(`Received a document from ${chatId}: ${document}`);

  if (document) {
    console.log(`Received a document from ${chatId}: ${document.file_name}`);
    msgController.handleDocument(bot, chatId, document);
  } else {
    console.log(`Received a non-document message from ${chatId}`);
  }
};

module.exports = { MessageHandler, DocumentHandler };
