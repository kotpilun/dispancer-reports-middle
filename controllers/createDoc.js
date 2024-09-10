import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { modifyDateOfBirth } from '../utils/modifyDateOfBirth.js';
import { modifySportsCategory } from '../utils/modifySportsCategory.js';
import { generateChampionshipReport } from '../report_generators/championship.js';
import { createZipArchive } from '../utils/createZip.js';
import { sendAndDeleteZipFile } from '../utils/sendAndDeleteZipFile.js';
import { deleteTemporaryFiles } from '../utils/deleteTemporaryFiles.js';
import { generateRuzaCupReport } from '../report_generators/ruzaCup.js';
import { generateOpenChampionshipReport } from '../report_generators/openChampionship.js';
import { generateGoldenFishReport } from '../report_generators/goldenFish.js';

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
    
    const createdFiles = [];
    
    // Для каждого диспансера создаем отдельный Excel-файл
    for (let dispancer of dispancers) {
        try {
            let filePath; // Объявляем переменную filePath вне блока switch
            
            switch (req.body.competitonType) {
                case 'Чемпионат':
                    childInfo.forEach(item => item.sportsCategory = modifySportsCategory(item));
                    filePath = await generateChampionshipReport(dispancer, childInfo, req.body.year, __dirname);
                    break;
                    case 'Ruza Cup':
                        filePath = await generateRuzaCupReport(dispancer, childInfo, req.body.year, req.body.dateOfCompetition, __dirname);
                        break;
                    case 'Открытый турнир':
                        filePath = await generateOpenChampionshipReport(dispancer, childInfo, req.body.year, req.body.dateOfCompetition, req.body.city, req.body.give, __dirname);
                        break;
                    case 'Золотая рыбка':
                        childInfo.forEach(item => item.sportsCategory = modifySportsCategory(item));
                        filePath = await generateGoldenFishReport(dispancer, childInfo, req.body.year, req.body.girlsBirthYears, req.body.boysBirthYears, req.body.stage, __dirname);
                        break;
                default:
                    throw new Error('Unsupported competition type');
            }

            // Добавляем файл в список созданных файлов
            createdFiles.push(filePath);

        } catch (error) {
            console.error('Error creating Excel file:', error);
            res.status(500).send('An error occurred while creating the files');
            return;
        }
    }

    // Создаем ZIP-архив
    const zipFilePath = path.join(__dirname, 'dispancers_reports.zip');

    try {
        await createZipArchive(createdFiles, zipFilePath);

        sendAndDeleteZipFile(res, zipFilePath);

        deleteTemporaryFiles(createdFiles);

    } catch (error) {
        console.error('Error creating ZIP archive:', error);
        res.status(500).send('An error occurred while creating the ZIP archive');
    }
}
