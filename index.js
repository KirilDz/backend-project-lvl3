import { NamesGenerator } from "./src/NamesGenerator.js";
import fs from "fs/promises";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { getLinksForDownloadingAndUpdateHtml } from "./src/temp1.js";
import { downloadPageData, downloadImage } from "./src/temp.js";

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
    downloadPageData(url)
        .then(response => {
            const { linksForDownloading, updatedLinksNames, updatedHtml } = getLinksForDownloadingAndUpdateHtml(response.data, urlInstance.origin, folderName);

                fs.mkdir(folderName).then(() => {
                    for (const [index, link] of linksForDownloading.entries()) {
                        downloadImage(link).then((response) => {
                            const buffer = response.data;
                            fs.writeFile(path.join(folderName, updatedLinksNames[index]), buffer).then(() => console.log('saved'));
                        });
                    }

                    // downloadImage(testLink).then((response) => {
                    //     const buffer = response.data;
                    //     console.log('this is buffer', buffer)
                    //     fs.writeFile(path.join(folderName, updatedImageLinksNames[0]), buffer).then(() => console.log('saved'));
                    // }).catch(err => console.log('this is err', err));
                });

                fs.writeFile(fileName, updatedHtml).then(() => console.log('File has been saved'));
        })
}
