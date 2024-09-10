import fs from 'fs';

export function sendAndDeleteZipFile(res, zipFilePath) {
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
};