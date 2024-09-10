import archiver from 'archiver';
import fs from 'fs';
import path from 'path';

/**
 * Функция для создания ZIP-архива из списка файлов
 * @param {Array} files - Список путей к файлам, которые необходимо добавить в архив
 * @param {string} zipFilePath - Путь, куда сохранить архив
 * @returns {Promise<void>}
 */
export async function createZipArchive(files, zipFilePath) {
    return new Promise((resolve, reject) => {
        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver('zip', { zlib: { level: 9 } });

        output.on('close', () => {
            console.log(`${archive.pointer()} total bytes`);
            console.log('Archiver has been finalized and the output file descriptor has closed.');
            resolve();
        });

        archive.on('error', (err) => {
            reject(err);
        });

        archive.pipe(output);

        // Добавляем файлы в архив
        files.forEach(filePath => {
            archive.file(filePath, { name: path.basename(filePath) });
        });

        // Завершаем архивирование
        archive.finalize();
    });
}
