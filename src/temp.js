import axios from "axios";
import fs from 'fs/promises';
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// export const downloadPageData = (url) => {
//     return Promise.resolve(axios.get(url));
// }
//
export const downloadImage = (url) => {
    return Promise.resolve(axios.get(url, { responseType: "arraybuffer" }));
}











