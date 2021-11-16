import axios from "axios";
import fs from 'fs/promises';
import { extname } from "path";

const downloadTextData = (url, name) => {
    return Promise.resolve(axios.get(url));
}

const downloadImageData = (url) => {
    return Promise.resolve(axios.get(url, { responseType: "arraybuffer" }));
}

const defineDownloadMethod = (url) => {
    switch (extname(url)) {
        case '.png':
            return downloadImageData(url);
        case '.jpg':
            return downloadImageData(url);
        default:
            return downloadTextData(url);
    }
}

export const saveData = (path, data) => {
    const checkPath = extname(path) ? path : path + '.html';

    return Promise.resolve(fs.writeFile(checkPath, data));
}

export const downloadData = (url) => {
    if (!url) {
        console.log('Url is not defined');
    }

    return defineDownloadMethod(url);
}















