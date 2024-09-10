import ExcelJS from 'exceljs';
import path from 'path';

/**
 * Функция для создания Excel файла для диспансера
 * @param {string} dispancer - Название диспансера
 * @param {Array} childInfo - Информация о детях
 * @param {number} year - Год для соревнований
 * @param {string} dirPath - Директория, куда сохранять файлы
 * @returns {Promise<string>} - Путь к созданному файлу
 */
export async function generateChampionshipReport(dispancer, childInfo, year, dirPath) {
    try {
        const workbook = new ExcelJS.Workbook();
        
        // Чтение существующего файла
        await workbook.xlsx.readFile('./reports/chempionat.xlsx');
        const worksheet = workbook.getWorksheet(1);

        const cell = worksheet.getRow(4).getCell('G');
        cell.value = `                       по плаванию на ${year} год`;

        // Вставка новых строк для каждого ребенка из текущего диспансера
        let insertRowIndex = 17; // Индекс строки, начиная с которой вставлять
        const filteredChildren = childInfo.filter(item => item.dispancer === dispancer);

        filteredChildren.forEach((value, index) => {
            const row = worksheet.insertRow(insertRowIndex + index, [
                index + 1, 
                `${value.surname} ${value.name} ${value.secondName}`, 
                value.dateOfBirth,
                value.sportsCategory,
                'Филиал СК «Атлант» МАУ «ГС «Авангард» г.о. Домодедово',
                value.address,
                'Якуш Татьяна Дмитриевна'
            ]);

            // Выровнять первую ячейку по центру
            const firstCell = row.getCell(1);
            firstCell.alignment = { horizontal: 'center' };

            // Оставшиеся ячейки с переносом текста, но без выравнивания
            row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
                if (colNumber !== 1) {
                    cell.alignment = { wrapText: true };
                }
            });
        });

        // Генерация имени файла и запись его в директорию
        const fileName = `dispancer_${dispancer}.xlsx`;
        const filePath = path.join(dirPath, fileName);
        await workbook.xlsx.writeFile(filePath);

        // Возвращаем путь к файлу
        return filePath;
    } catch (error) {
        throw new Error(`Error creating Excel file for ${dispancer}: ${error.message}`);
    }
}
