import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { test, expect } from '@jest/globals';
import * as path from "path";
import fs from 'fs';
import os from 'os';
import nock from "nock";
import { getPageData, saveFile, getFileName } from "../src/temp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

nock.disableNetConnect();

let tempFolder;

beforeEach(async () => {
    await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'), (err, folder) => {
        if (err) throw err;
        tempFolder = folder;
    });
});

console.log('global', tempFolder)

test('Test main flow', async () => {

    const responseData = 'HTML & CSS & JS';
    const url = 'https://ru.hexlet.io/courses';
    const fileName = getFileName(url);

    const scope = nock('https://ru.hexlet.io')
        .get('/courses')
        .reply(200, responseData);

    await getPageData(url);

     fs.writeFileSync(path.join(tempFolder, fileName + '.html'));

    const isExist = fs.existsSync(path.join(tempFolder, fileName + '.html'));

    console.log(isExist)

    expect(scope.isDone()).toBe(true);
})







