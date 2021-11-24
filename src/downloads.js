import axios from 'axios';
// import axiosDebugLog from 'axios-debug-log/enable.js';
import fs from 'fs/promises';
import { extname } from 'path';
// import { log } from 'debug';

const downloadTextData = (url) => Promise.resolve(axios.get(url))
    .catch((e) => {
        console.log('from download text');
        // process.exit(1);
        throw e;
    });

const downloadImageData = (url) => Promise.resolve(axios.get(url, { responseType: 'arraybuffer' }))
    .catch((e) => {
        console.log('from download image');
        // process.exit(1);
        throw e;
    });

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

    return Promise.resolve(fs.writeFile(checkPath, data))
        .catch((e) => {
            console.log('from save data block');
            // process.exit(1);
            throw e;
        });
};

export const createDirectory = (path) => {
    return Promise.resolve(fs.mkdir(path)).catch((e) => {
        console.log('From save data block');
        // process.exit(1);
        throw e;
    });
};

export const downloadData = (url) => {
    if (!url) {
        throw new Error('Url is not defined!');
    }

    return defineDownloadMethod(url);
};
