import axios from "axios";
import fs from 'fs';

const url = 'https://ru.hexlet.io/courses';

export const getFileName = (url) => {
    const httpsString = /https:\/\//gm
    const symbolsForReplacing = /[.\/]/gm

    return url.replace(httpsString, '').replace(symbolsForReplacing, '-');
}

export const saveFile = (url, data) => {
    const fileName = getFileName(url);

    fs.writeFile(fileName + '.html', data, (err) => {
        if (err) console.log(err);
        // console.log('Writing is completed!');
    })
}

export const load2 = (url) => {
    return new Promise(resolve => {
        resolve(axios.get(url));
    })
}

// load2(url).then(res => {
//     saveFile(url, res.data);
// }).catch(e => console.log(e));









