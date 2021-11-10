import { NamesGenerator } from "./src/NamesGenerator.js";
import fs from "fs/promises";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { getLinksForDownloadingAndUpdateHtml } from "./src/temp1.js";
import { downloadData, saveData } from "./src/temp.js";

const url = 'https://ru.hexlet.io/courses';
const TEAMS_PAGE = 'https://ru.hexlet.io/teams';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


export default async (url, folder) => {
    const urlInstance = new URL(url);
    const namesGeneratorInstance = new NamesGenerator(urlInstance);

    const fileName = namesGeneratorInstance.getPageName();
    const folderName = namesGeneratorInstance.getFolderName();

    // return fs.readFile(path.join(__dirname, '__fixtures__', 'test-html-file_before.html'), 'utf8')
    downloadData(url)
        .then(response => {
            const { linksForDownloading, updatedLinksNames, updatedHtml } = getLinksForDownloadingAndUpdateHtml(response.data, urlInstance.origin, folderName);

                fs.mkdir(folderName).then(() => {
                    for (const [index, link] of linksForDownloading.entries()) {
                        downloadData(link).then((response) => {
                            const data = response.data;

                            saveData(path.join(folderName, updatedLinksNames[index]), data).then(() => console.log('saved'));
                        });
                    }
                });

                saveData(fileName, updatedHtml).then(() => console.log('File has been saved'));
        })
}
