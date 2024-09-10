import fs from 'fs';

export function deleteTemporaryFiles(createdFiles) {
    createdFiles.forEach((filePath) => {
        fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
                console.error(`Error deleting file ${filePath}:`, unlinkErr);
            } else {
                console.log(`File ${filePath} deleted successfully`);
            }
        });
    });
};