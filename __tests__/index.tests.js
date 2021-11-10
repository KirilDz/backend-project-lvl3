import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { test, expect } from '@jest/globals';
import * as path from "path";
import fs from 'fs/promises';
import os from 'os';
import nock from "nock";
import { NamesGenerator } from "../src/NamesGenerator";
import { getLinksForDownloadingAndUpdateHtml } from "../src/temp1.js";
import { downloadPageData, downloadImage } from "../src/temp.js";
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

nock.disableNetConnect();

let tempFolder;

beforeEach(async () => {
    tempFolder = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
})

// test('Test save file', async () => {
//     const testFileName = 'test-file.html';
//     const testText = 'test';
//
//     const returnValue = await saveFile(testFileName, testText, tempFolder);
//
//     const fileData = await fs.readFile(path.join(tempFolder, testFileName), 'utf8');
//
//     expect(returnValue).toBe(path.join(tempFolder, testFileName));
//     expect(fileData).toBe(testText);
// })
//
// test('Test get name', () => {
//     const testUrl = 'https://ru.hexlet.io/courses';
//     expect(getName(testUrl)).toBe('ru-hexlet-io-courses');
// })

test('Test main flow', async () => {
    const testUrl = 'https://ru.hexlet.io/courses';

    // Expected values
    const expectedFileName = 'ru-hexlet-io-courses.html';
    const expectedFolderName = 'ru-hexlet-io-courses_files';
    const expectedResponseData = await fs.readFile(getFixturePath('test-html-file_before.html'), 'utf8');
    const HTMLAfter = await fs.readFile(getFixturePath('test-html-file_after.html'), 'utf8');
    const splitedHTML = HTMLAfter.split('\n');
    const expectedUpdatedHTML = splitedHTML.slice(0, splitedHTML.length-1).join('\n');
    const expectedImageData = await fs.readFile(getFixturePath('test-img-file.png'), null);
    const expectedJsData = await fs.readFile(getFixturePath('test-javaScript-file.js'), 'utf8');
    const expectedCssData = await fs.readFile(getFixturePath('test-css-file.css'), 'utf8');

    const expectedLinksForDownloading = [
        'https://ru.hexlet.io/assets/application.css',
        'https://ru.hexlet.io/courses.html',
        'https://ru.hexlet.io/assets/professions/nodejs.png',
        'https://ru.hexlet.io/packs/js/runtime.js'
    ];
    const expectedDownloadedFileNames = [
        'ru-hexlet-io-assets-application.css',
        'ru-hexlet-io-courses.html',
        'ru-hexlet-io-assets-professions-nodejs.png',
        'ru-hexlet-io-packs-js-runtime.js'
    ];

    // Test values
    const testUrlInstance = new URL(testUrl);
    const testNameGeneratorInstance = new NamesGenerator(testUrlInstance);

    const testFileName = testNameGeneratorInstance.getPageName();
    const testFolderName = testNameGeneratorInstance.getFolderName();

    expect(testFileName).toEqual(expectedFileName);
    expect(testFolderName).toEqual(expectedFolderName);

    const scope = nock('https://ru.hexlet.io')
        .get('/courses')
        .reply(200, expectedResponseData);

    await downloadPageData(testUrl);

    expect(scope.isDone()).toBe(true);

    const {
        linksForDownloading,
        updatedLinksNames,
        updatedHtml
    } = getLinksForDownloadingAndUpdateHtml(expectedResponseData, testUrlInstance.origin, testFolderName);

    expect(linksForDownloading).toEqual(expectedLinksForDownloading);
    expect(updatedLinksNames).toEqual(expectedDownloadedFileNames);
    expect(updatedHtml).toEqual(expectedUpdatedHTML);

    for (const link of linksForDownloading) {
        const url = new URL(link);

        const scope2 = nock(url.host)
            .get(url.pathname)
            .reply(200, expectedImageData);

        await downloadImage(link);

        expect(scope2.isDone()).toBe(true);
    }

})







