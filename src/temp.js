import axios from "axios";
import fs from 'fs/promises';
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

export const downloadPageData = (url) => {
    return Promise.resolve(axios.get(url));
}










