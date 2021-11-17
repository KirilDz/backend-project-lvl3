import fs from 'fs/promises';
import path, { dirname } from 'path';
import { NamesGenerator } from './src/NamesGenerator.js';
import getLinksForDownloadingAndUpdateHtml from './src/temp1.js';
import { downloadData, saveData } from './src/downloads.js';

export default async (url, folder) => {
    const urlInstance = new URL(url);
    const namesGeneratorInstance = new NamesGenerator(urlInstance);

    const fileName = namesGeneratorInstance.getPageName();
    const folderName = namesGeneratorInstance.getFolderName();

    downloadData(url)
        .then((response) => {
            const {
                linksForDownloading,
                updatedLinksNames,
                updatedHtml,
            } = getLinksForDownloadingAndUpdateHtml(response.data, urlInstance.origin, folderName);

            // return {
            //     linksForDownloading,
            //     updatedLinksNames,
            //     updatedHtml,
            // };
        })
        .then(() => {

        })
        .then(() => {

        })
        .catch((err) => {
            console.error('This is global ERROR', err);
        });
};
