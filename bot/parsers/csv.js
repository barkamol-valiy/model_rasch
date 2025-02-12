const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const handleCSV = async (bot, chatId, fileId, fileName) => {
  try {
    const downloadsDir = path.join(__dirname, "..", "downloads");
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir);
    }

    const fetch = (await import("node-fetch")).default;

    const fileLink = await bot.getFileLink(fileId);

    const response = await fetch(fileLink);
    const fileBuffer = await response.buffer();

    const filePath = path.join(downloadsDir, fileName);
    fs.writeFileSync(filePath, fileBuffer);

    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        let readableData = "```\n"; // Start Markdown code block
        readableData += Object.keys(results[0]).join(", ") + "\n"; // Header row
        readableData += results
          .map((row) => Object.values(row).join(", "))
          .join("\n"); // First 10 rows
        readableData += "```"; // End Markdown code block

        console.log("CSV Data:", results);
        bot.sendMessage(
          chatId,
          `Read ${results.length} rows from the CSV file:\n${readableData}`,
          { parse_mode: "MarkdownV2" }
        );
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Error deleting file:", err.message);
          } else {
            console.log(`File ${fileName} has been deleted.`);
          }
        });
      });
  } catch (error) {
    console.error("Error handling document:", error.message);
    bot.sendMessage(chatId, "Failed to handle the document.");
  }
};

module.exports = { handleCSV };
