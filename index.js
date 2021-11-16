import fs from 'fs/promises';
import path, { dirname } from 'path';
import { NamesGenerator } from './src/NamesGenerator.js';
import getLinksForDownloadingAndUpdateHtml from './src/temp1.js';
import { downloadData, saveData } from './src/downloads.js';

const url = 'https://ru.hexlet.io/courses';
const TEAMS_PAGE = 'https://ru.hexlet.io/teams';

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

            fs.mkdir(folderName)
                .then(() => {
                    for (const [index, link] of linksForDownloading.entries()) {
                        downloadData(link)
                            .then((responseData) => {
                                const { data } = responseData;

                                saveData(path.join(folderName, updatedLinksNames[index]), data)
                                    .then(() => console.log('saved'))
                                    .catch((err) => {
                                        console.error('Ups, we have an error', err);
                                    });
                            })
                            .catch((err) => {
                                console.error('This is error from inside', err);
                            });
                    }
                });

            saveData(fileName, updatedHtml)
                .then(() => console.log('File has been saved'));
        })
        .catch((err) => {
            console.error('This is error', err);
        });
};
