import axios from "axios";
import fs from 'fs/promises'
import { fileURLToPath } from "url";
import { dirname } from "path";
import * as path from "path";
import cheerio from "cheerio";
import { NamesGenerator } from "./NamesGenerator.js";
import debug from 'debug';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TEAMS_PAGE = 'https://ru.hexlet.io/teams';

const filterLink = (baseUrlOrigin, link) => {
    if (!link) {
        return false;
    }

    const urlForFilter = new URL(link, baseUrlOrigin);

    return baseUrlOrigin === urlForFilter.origin;
}

export const getLinksForDownloadingAndUpdateHtml = (page, urlOrigin, folderName) => {
    const $ = cheerio.load(page);

    const mainLinkUrlInstance = new URL(urlOrigin);

    const nameGeneratorInstance = new NamesGenerator(mainLinkUrlInstance);

    const linksForDownloading = [];
    const updatedLinksNames = [];

    const tagsMapping = {
        link: 'href',
        img: 'src',
        script: 'src'
    }

    for (const tagsMappingElement of Object.entries(tagsMapping)) {
        $(tagsMappingElement[0]).each(function () {

            const link = $(this).attr(tagsMappingElement[1]);

            if (filterLink(urlOrigin, link)) {
                const fullLink = link.includes('http') ? link : `${ mainLinkUrlInstance.origin }${ link }`;

                const updatedName = nameGeneratorInstance.getImageName(fullLink);

                $(this).attr(tagsMappingElement[1], `${ folderName }/${ updatedName }`)

                linksForDownloading.push(fullLink);
                updatedLinksNames.push(updatedName);
            }

        })
    }

    return {
        linksForDownloading,
        updatedLinksNames,
        updatedHtml: $.html()
    };
}


