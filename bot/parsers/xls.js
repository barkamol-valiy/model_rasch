const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const handleXLS = async (bot, chatId, fileId, fileName) => {
  try {
    // Ensure the downloads directory exists
    const downloadsDir = path.join(__dirname, "..", "downloads");
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir);
    }

    // Dynamically import node-fetch
    const fetch = (await import("node-fetch")).default;

    // Get the file link from Telegram
    const fileLink = await bot.getFileLink(fileId);

    // Download the file
    const response = await fetch(fileLink);
    const fileBuffer = await response.buffer();

    // Save the file locally
    const filePath = path.join(downloadsDir, fileName);
    fs.writeFileSync(filePath, fileBuffer);

    // Read the contents of the file
    if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      // Convert data to a readable string
      const readableData = data
        .map((row) => Object.values(row).join(", "))
        .join("\n");

      console.log("Excel Data:", data);
      bot.sendMessage(
        chatId,
        `Read ${data.length} rows from the Excel file:\n${readableData}`
      );
    } else if (fileName.endsWith(".csv")) {
      // Handle CSV file reading if needed
      bot.sendMessage(chatId, "CSV file received.");
    }

    // Delete the file after processing
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Error deleting file:", err.message);
      } else {
        console.log(`File ${fileName} has been deleted.`);
      }
    });
  } catch (error) {
    console.error("Error handling document:", error.message);
    bot.sendMessage(chatId, "Failed to handle the document.");
  }
};

module.exports = { handleXLS };
