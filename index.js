import { getPageData, saveFile } from "./src/temp.js";

const testLogic = (url) => {
    getPageData(url).then(data => {

       saveFile(url, data.data);

    }).catch(e => console.log(e));
}

const url = 'https://ru.hexlet.io/courses';

testLogic(url);
