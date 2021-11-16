import axios from 'axios';
import axiosDebugLog from 'axios-debug-log/enable.js';
import fs from 'fs/promises';
import { extname } from "path";

const downloadTextData = (url, name) => Promise.resolve(axios.get(url)
    .catch((err) => {
        console.error(err);
        throw new Error(`Error while downloading file: ${err}`);
    }));

const downloadImageData = (url) => Promise.resolve(axios.get(url, { responseType: 'arraybuffer' })
    .catch((err) => {
        console.error(err);
        throw new Error(`Error while downloading image: ${err}`);
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
    const checkPath = extname(path) ? path : path + '.html';

    return Promise.resolve(fs.writeFile(checkPath, data)
        .catch((err) => {
            console.error(err);
            throw new Error(`Error while saving data: ${err}`);
        }));
};

export const downloadData = (url) => {
    if (!url) {
        console.log('Url is not defined');
    }

    return defineDownloadMethod(url);
};
