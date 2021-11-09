import cheerio from 'cheerio';
import fs from 'fs/promises';
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { NamesGenerator } from "./NamesGenerator.js";
import debug from "debug";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getPage = async () => {
    return fs.readFile(path.join(__dirname, '../__fixtures__/test-html-file_before.html'), 'utf8');
}

const filterLink = (base, link) => {
    const baseUrl = new URL(base);
    const urlForFilter = new URL(link, base);

    return baseUrl.origin === urlForFilter.origin;
}

const getLinksForDownloadingAndUpdateHtml = async (page1, mainLink = 'https://ru.hexlet.io/courses', folderName = 'ru-hexlet-io-courses_files') => {
    const page = await getPage()
    const $ = cheerio.load(page);

    const mainLinkUrlInstance = new URL(mainLink);

    const nameGeneratorInstance = new NamesGenerator(mainLinkUrlInstance);

    const links = [];

    const tagsMapping = {
        link: 'href',
        img: 'src',
        script: 'src'
    }

    for (const tagsMappingElement of Object.entries(tagsMapping)) {
        $(tagsMappingElement[0]).each(function () {

            const link = $(this).attr(tagsMappingElement[1]);

            if (filterLink(mainLink, link)) {
                const fullLink = link.includes('http') ? link : `${mainLinkUrlInstance.origin}${link}`;

                const updatedName = nameGeneratorInstance.getImageName(fullLink);

                $(this).attr(tagsMappingElement[1], `${ folderName }/${ updatedName }`)

                links.push(fullLink);
            }

        })
    }

    return {
        links,
        updatedHtml: $.html()
    };
}




getLinksForDownloadingAndUpdateHtml().then((res) => console.log(res))
