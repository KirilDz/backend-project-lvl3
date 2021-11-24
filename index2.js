import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { NamesGenerator } from './src/NamesGenerator.js';
import getLinksForDownloadingAndUpdateHtml from './src/temp1.js';
import { downloadData, saveData, createDirectory } from './src/downloads.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getPathForDownloading = (userPath) => {
    if (userPath !== process.cwd()) {
        return path.join(process.cwd(), '..', '..', userPath);
    }

    return process.cwd();
};

export default async (url, folder) => {
    const urlInstance = new URL(url);
    const namesGeneratorInstance = new NamesGenerator(urlInstance);

    const fileName = namesGeneratorInstance.getPageName();
    const folderName = namesGeneratorInstance.getFolderName();

    const downloadFolderPath = getPathForDownloading(folder);

    let pageData;

    downloadData(url)
        .then((response) => {
            console.log('First then');
            pageData = getLinksForDownloadingAndUpdateHtml(response.data, urlInstance.origin, folderName);

            return createDirectory(path.join(downloadFolderPath, folderName));
        })
        .then(() => {
            console.log('Second then');
            const {
                linksForDownloading,
                updatedLinksNames,
                updatedHtml,
            } = pageData;

            const promise = linksForDownloading.map((link, index) => downloadData(link)
                .then((responseData) => {
                    const { data } = responseData;

                    return saveData(path.join(downloadFolderPath, folderName, updatedLinksNames[index]), data);
                }));

            const promise1 = saveData(fileName, updatedHtml);

            return Promise.all(promise.concat(promise1));
        })
        .then(() => console.log(path.join(__dirname, fileName)))
        .catch((err) => {
            console.error('This is global ERROR');

            console.error(err.errno)
        });
};
