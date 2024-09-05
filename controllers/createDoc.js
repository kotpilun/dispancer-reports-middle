import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Получаем путь к текущему модулю
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createDoc(req, res) {
    try {
        const workbook = new ExcelJS.Workbook();
        
        // Чтение существующего файла
        await workbook.xlsx.readFile('test.xlsx');

        // Массив значений для записи
        const valuesToInsert = [1, 2, 3, 4, 5];

        // Обработка каждого листа в книге
        for (const worksheet of workbook.worksheets) {
            let insertRowIndex = 7; // Индекс строки, начиная с которой вставлять

            // Вставка новых строк с использованием insertRow
            valuesToInsert.forEach((value, index) => {
                worksheet.insertRow(insertRowIndex + index, [value]);
            });
        }

        // Запись новой книги в файл
        const filePath = path.join(__dirname, 'new.xlsx');
        await workbook.xlsx.writeFile(filePath);

        // Отправка файла клиенту
        res.download(filePath, 'new.xlsx', (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error sending file');
            } else {
                // Удаление файла после успешной отправки
                fs.unlink(filePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Error deleting file:', unlinkErr);
                    } else {
                        console.log('File deleted successfully');
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error creating Excel file:', error);
        res.status(500).send('An error occurred while creating the file');
    }
}