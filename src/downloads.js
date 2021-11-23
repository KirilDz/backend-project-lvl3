import axios from 'axios';
// import axiosDebugLog from 'axios-debug-log/enable.js';
import fs from 'fs/promises';
import { extname } from 'path';
import { log } from 'debug';

const downloadTextData = (url) => Promise.resolve(axios.get(url)
    .catch((err) => {
        throw new Error(err);
    }));

const downloadImageData = (url) => Promise.resolve(axios.get(url, { responseType: 'arraybuffer' }).catch((err) => {
    throw new Error(err);
}));

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
    const checkPath = extname(path) ? path : `${path}.html`;

    return Promise.resolve(fs.writeFile(checkPath, data)).catch(e => {
        throw new Error(e);
    });
};

export const downloadData = (url) => {
    if (!url) {
        throw new Error('Url is not defined!');
    }

    return defineDownloadMethod(url);
};
