import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { modifyDateOfBirth } from '../utils/modifyDateOfBirth.js';
import { modifySportsCategory } from '../utils/modifySportsCategory.js';
import archiver from 'archiver';
import { generateChampionshipReport } from '../report_generators/championship.js';


// Получаем путь к текущему модулю
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createDoc(req, res) {
    const dispancers = new Set();
    console.log('req.body', req.body);

    // Забираем из тела запроса уникальный список диспансеров
    if (Array.isArray(req.body?.childInfo) && req.body?.childInfo.length > 0) {
        req.body.childInfo.forEach(item => {
            dispancers.add(item.dispancer); 
        });
    }

    const childInfo = req.body.childInfo;
    childInfo.forEach(item => item.dateOfBirth = modifyDateOfBirth(item.dateOfBirth));
    childInfo.forEach(item => item.sportsCategory = modifySportsCategory(item));

    // Создаем ZIP архив
    const zipFilePath = path.join(__dirname, 'dispancers_reports.zip');
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
        console.log(`${archive.pointer()} total bytes`);
        console.log('Archiver has been finalized and the output file descriptor has closed.');

        // Отправляем архив клиенту
        res.download(zipFilePath, 'dispancers_reports.zip', (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error sending file');
            } else {
                // Удаляем архив после отправки
                fs.unlink(zipFilePath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error('Error deleting zip file:', unlinkErr);
                    } else {
                        console.log('Zip file deleted successfully');
                    }
                });
            }
        });
    });

    archive.on('error', (err) => {
        throw err;
    });

    archive.pipe(output);

    const createdFiles = [];

    // Для каждого диспансера создаем отдельный Excel-файл, используя функцию из нового файла
    for (let dispancer of dispancers) {

        try {
            let filePath;
            switch (req.body.competitonType) {
                case 'Чемпионат':
                    filePath = await generateChampionshipReport(dispancer, childInfo, req.body.year, __dirname);
                    break;
                case 'Gold fish':
                    filePath = await generateGoldFishReport(dispancer, childInfo, req.body.year, __dirname);
                    break;
            
                default:
                    break;
            }

            // Добавляем файл в архив
            archive.file(filePath, { name: path.basename(filePath) });
            createdFiles.push(filePath);  // Добавляем файл в список созданных файлов

        } catch (error) {
            console.error('Error creating Excel file:', error);
            res.status(500).send('An error occurred while creating the files');
            return;
        }
    }

    // Завершаем архивирование
    await archive.finalize();

    // После завершения архивации удаляем временные Excel файлы
    createdFiles.forEach((filePath) => {
        fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
                console.error(`Error deleting file ${filePath}:`, unlinkErr);
            } else {
                console.log(`File ${filePath} deleted successfully`);
            }
        });
    });
}
