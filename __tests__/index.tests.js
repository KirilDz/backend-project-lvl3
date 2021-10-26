import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { test, expect } from '@jest/globals';
import fs from 'fs';
import os from 'os';
import nock from "nock";
import { load2 } from "../src/temp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

nock.disableNetConnect();

beforeEach(async () => {
    await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'), (err, folder) => {
        if (err) throw err;
        console.log('this is folder',folder)
    });
});

test('getPageData', async () => {

const scope = nock('https://ru.hexlet.io')
    .get('/courses')
    .reply(200, 'page data')

    await load2('https://ru.hexlet.io/courses')

    expect(scope.isDone()).toBe(true)
})







