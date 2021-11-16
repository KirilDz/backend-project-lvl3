import { fileURLToPath } from 'url';
import { dirname, extname } from 'path';
import { test, expect } from '@jest/globals';
import * as path from "path";
import fs from 'fs/promises';
import os from 'os';
import nock from "nock";
import { NamesGenerator } from "../src/NamesGenerator";
import { getLinksForDownloadingAndUpdateHtml } from "../src/temp1.js";
import { downloadData, saveData } from "../src/temp.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

nock.disableNetConnect();

let tempFolder;

beforeEach(async () => {
    tempFolder = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
})

test('Test main flow', async () => {
    const testUrl = 'https://ru.hexlet.io/courses';

    // Expected values
    const expectedFileName = 'ru-hexlet-io-courses.html';
    const expectedFolderName = 'ru-hexlet-io-courses_files';
    const expectedResponseData = await fs.readFile(getFixturePath('test-html-file_before.html'), 'utf8');
    const expectedEditedHTMLFile = await fs.readFile(getFixturePath('test-html-file_after.html'), 'utf8');
    const HTMLAfter = await fs.readFile(getFixturePath('test-html-file_after.html'), 'utf8');
    const splitedHTML = HTMLAfter.split('\n');
    const expectedUpdatedHTML = splitedHTML.slice(0, splitedHTML.length-1).join('\n');
    const expectedImageData = await fs.readFile(getFixturePath('test-img-file.png'), null);
    const expectedJsData = await fs.readFile(getFixturePath('test-javaScript-file.js'), 'utf8');
    const expectedCssData = await fs.readFile(getFixturePath('test-css-file.css'), 'utf8');
    const expectHTMLData = await fs.readFile(getFixturePath('test-html-file.html'), 'utf8');

    const expectedFileData = [expectedCssData, expectHTMLData, expectedImageData, expectedJsData];

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

    await downloadData(testUrl);

    expect(scope.isDone()).toBe(true);

    const {
        linksForDownloading,
        updatedLinksNames,
        updatedHtml
    } = getLinksForDownloadingAndUpdateHtml(expectedResponseData, testUrlInstance.origin, testFolderName);

    expect(linksForDownloading).toEqual(expectedLinksForDownloading);
    expect(updatedLinksNames).toEqual(expectedDownloadedFileNames);
    expect(updatedHtml).toEqual(expectedUpdatedHTML);

    console.log(linksForDownloading)

    for (const [index, link] of Object.entries(linksForDownloading)) {
        const url = new URL(link);

        const scope2 = nock(url.origin)
            .get(url.pathname)
            .reply(200, expectedFileData[index]);

        await downloadData(link);

        expect(scope2.isDone()).toBe(true);
    }

    await fs.mkdir(path.join(tempFolder, testFolderName));

    for (const [index ,data] of Object.entries(expectedFileData)) {
        await saveData(path.join(tempFolder, testFolderName, updatedLinksNames[index]), data);
    }

    await saveData(path.join(tempFolder, expectedFileName), updatedHtml);

    const wroteHTMLdata = await fs.readFile(path.join(tempFolder, expectedFileName), 'utf8');

    expect(expectedEditedHTMLFile).toEqual(wroteHTMLdata + '\n');

    for (const [index, updatedLinkName] of Object.entries(updatedLinksNames)) {
        if (extname(updatedLinkName) !== '.png') {
            const wroteData = await fs.readFile(path.join(tempFolder, testFolderName, updatedLinkName), 'utf8');

            expect(wroteData).toEqual(expectedFileData[+index]);
        }
    }

})







