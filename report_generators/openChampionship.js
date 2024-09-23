import ExcelJS from "exceljs";
import path from "path";

/**
 * Функция для создания Excel файла для диспансера
 * @param {string} dispancer - Название диспансера
 * @param {Array} childInfo - Информация о детях
 * @param {number} year - Год для соревнований
 * @param {string} dirPath - Директория, куда сохранять файлы
 * @returns {Promise<string>} - Путь к созданному файлу
 */
export async function generateOpenChampionshipReport(
  dispancer,
  childInfo,
  year,
  dateOfCompetition,
  city,
  give,
  dirPath
) {
  try {
    const workbook = new ExcelJS.Workbook();

    // Чтение существующего файла
    await workbook.xlsx.readFile("./reports/turnir.xlsx");
    const worksheet = workbook.getWorksheet(1);

    let cell = worksheet.getRow(4).getCell("A");
    cell.value = `г. ${city}, ${dateOfCompetition} ${year} года`;

    cell = worksheet.getRow(2).getCell("A");
    cell.value = give;

    // Вставка новых строк для каждого ребенка из текущего диспансера
    let insertRowIndex = 6; // Индекс строки, начиная с которой вставлять
    const filteredChildren = childInfo.filter(
      (item) => item.dispancer === dispancer
    );

    filteredChildren.forEach((value, index) => {
      const row = worksheet.insertRow(insertRowIndex + index, [
        index + 1,
        `${value.surname} ${value.name} ${value.secondName}`,
        value.dateOfBirth,
        value.sportsCategory,
        "Атлант — Домодедово",
        "Якуш Т. Д.",
      ]);

      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        if (colNumber !== 1) {
          cell.alignment = { wrapText: true, horizontal: "center" };
        }
      });

      // Выровнять первую ячейку по центру
      const firstCell = row.getCell(2);
      firstCell.alignment = { horizontal: "left" };
    });

    // Генерация имени файла и запись его в директорию
    const fileName = `dispancer_${dispancer}.xlsx`;
    const filePath = path.join(dirPath, fileName);
    await workbook.xlsx.writeFile(filePath);

    // Возвращаем путь к файлу
    return filePath;
  } catch (error) {
    throw new Error(
      `Error creating Excel file for ${dispancer}: ${error.message}`
    );
  }
}
