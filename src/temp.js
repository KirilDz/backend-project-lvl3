import axios from "axios";
import fs from 'fs';
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const url = 'https://ru.hexlet.io/courses';

export const getFileName = (url) => {
    const httpsString = /https:\/\//gm
    const symbolsForReplacing = /[.\/]/gm

    return url.replace(httpsString, '').replace(symbolsForReplacing, '-');
}

export const saveFile = (url, data, folder = 'saved', isTest = false) => {
    const fileName = getFileName(url);

    const pathToFile = path.join(__dirname, '..', folder, fileName + '.html');

    fs.writeFile(isTest ? folder : pathToFile, data, (err) => {
        if (err) return err;
        return 'success';
    });
}

export const getPageData = (url) => {
    return new Promise(resolve => {
        resolve(axios.get(url));
    })
}

// getPageData(url).then(res => {
//     saveFile(url, res.data);
// }).catch(e => console.log(e));









