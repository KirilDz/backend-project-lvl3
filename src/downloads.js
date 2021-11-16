import axios from 'axios';
import axiosDebugLog from 'axios-debug-log/enable.js';
import fs from 'fs/promises';
import { extname } from 'path';

const downloadTextData = (url, name) => Promise.resolve(axios.get(url)
    .catch((err) => {
        throw new Error(err);
    }));

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
    const checkPath = extname(path) ? path : `${path}.html`;

    return Promise.resolve(fs.writeFile(checkPath, data)
        .catch((err) => {
            throw new Error(err);
        }));
};

export const downloadData = (url) => {
    if (!url) {
        throw new Error('Url is not defined!');
    }

    return defineDownloadMethod(url).catch((err) => {
        console.log('this is error status', err.response.status);
        console.log('this is error text', err.response.statusText);
        throw new Error(err);
    });
};
