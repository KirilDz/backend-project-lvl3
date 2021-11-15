import axios from 'axios';
import fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname, extname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const downloadTextData = (url, name) => Promise.resolve(axios.get(url));

const downloadImageData = (url) => Promise.resolve(axios.get(url, { responseType: 'arraybuffer' }));

const defineDownloadMethod = (url) => {
    switch (extname(url)) {
        case '.png':
            return downloadImageData(url);
        case '.jpg':
            return downloadImageData(url);
        default:
            return downloadTextData(url);
    }
};

export const saveData = (path, data) => {
    const checkPath = extname(path) ? path : path + '.html';

    return Promise.resolve(fs.writeFile(checkPath, data));
};

export const downloadData = (url) => {
    if (!url) {
        console.log('Url is not defined');
    }

    return defineDownloadMethod(url);
};

downloadData('https://ru.hexlet.io/teams')
    .then((res) => console.log(res));
