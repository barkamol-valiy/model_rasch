const path = require("path");
const fs = require("fs");
const XLSX = require("xlsx");

const handleXLS = async (bot, chatId, fileId, fileName) => {
  try {
    const downloadsDir = path.join(__dirname, "..", "downloads");
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir);
    }

    const fetch = (await import("node-fetch")).default;
    const fileLink = await bot.getFileLink(fileId);
    const response = await fetch(fileLink);
    const fileBuffer = await response.arrayBuffer();

    const filePath = path.join(downloadsDir, fileName);
    fs.writeFileSync(filePath, Buffer.from(fileBuffer));

    if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      console.log("Raw Data:", data);

      const headers = data[0];
      const matrix = data.slice(1);

      // Compute ability logits
      const abilityLogits = matrix.map((row) => {
        const answers = row.slice(1);
        const correctCount = answers.reduce((sum, val) => sum + val, 0);
        return correctCount > 0
          ? Math.log(correctCount / (answers.length - correctCount))
          : NaN;
      });

      // Compute difficulty logits
      const difficultyLogits = headers.slice(1).map((_, colIdx) => {
        const correctCount = matrix.reduce(
          (sum, row) => sum + row[colIdx + 1],
          0
        );
        return correctCount > 0
          ? Math.log(correctCount / (matrix.length - correctCount))
          : NaN;
      });

      console.log("Ability Logits:", abilityLogits);
      console.log("Difficulty Logits:", difficultyLogits);

      // Prepare data for a single sheet with 4 columns
      const combinedData = [
        ["Student", "Ability Logit", "Question", "Difficulty Logit"],
      ];
      for (let i = 0; i < Math.max(matrix.length, headers.length - 1); i++) {
        combinedData.push([
          matrix[i] ? matrix[i][0] : "", // Student name
          abilityLogits[i] !== undefined ? abilityLogits[i] : "", // Ability logit
          headers[i + 1] ? `Q${headers[i + 1]}` : "", // Question number
          difficultyLogits[i] !== undefined ? difficultyLogits[i] : "", // Difficulty logit
        ]);
      }

      const newWorkbook = XLSX.utils.book_new();
      const combinedSheet = XLSX.utils.aoa_to_sheet(combinedData);
      XLSX.utils.book_append_sheet(newWorkbook, combinedSheet, "Logits");

      // Apply formatting
      const sheetRange = XLSX.utils.decode_range(combinedSheet["!ref"]);

      // **Set Column Widths**
      combinedSheet["!cols"] = [
        { wch: 15 }, // Student
        { wch: 15 }, // Ability Logit
        { wch: 15 }, // Question
        { wch: 15 }, // Difficulty Logit
      ];

      // **Format Headers (Bold + Centered)**
      for (let col = sheetRange.s.c; col <= sheetRange.e.c; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: col }); // Header row (first row)
        if (combinedSheet[cellRef]) {
          combinedSheet[cellRef].s = {
            font: { bold: true, sz: 12, color: { rgb: "FFFFFF" } }, // White text, size 12
            fill: { fgColor: { rgb: "4F81BD" } }, // Blue background
            alignment: { horizontal: "center", vertical: "center" }, // Center alignment
          };
        }
      }

      // **Format Data Cells (Center-align)**
      for (let row = 1; row <= sheetRange.e.r; row++) {
        for (let col = 0; col <= sheetRange.e.c; col++) {
          const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
          if (combinedSheet[cellRef]) {
            combinedSheet[cellRef].s = {
              font: { sz: 11 },
              alignment: { horizontal: "center", vertical: "center" },
            };
          }
        }
      }

      // Save new file
      const newFilePath = path.join(downloadsDir, `results_${fileName}`);
      XLSX.writeFile(newWorkbook, newFilePath);

      // Send new file
      await bot.sendDocument(chatId, newFilePath);

      // Delete file after sending
      fs.unlinkSync(newFilePath);
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("Error processing Excel file:", error);
  }
};

module.exports = { handleXLS };
