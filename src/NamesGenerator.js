export class NamesGenerator {
    symbolsForReplacingPageLink = /[.\/]/gm;
    symbolsForReplacingImageLink = /[\/]/gm;

    constructor(urlInstance) {
        this.urlInstance = urlInstance;
    }

    getPageName() {
        return `${this.urlInstance.hostname}${this.urlInstance.pathname}`.replace(this.symbolsForReplacingPageLink, '-') + '.html';
    }

    getFolderName() {
        return `${this.urlInstance.hostname}${this.urlInstance.pathname}`.replace(this.symbolsForReplacingPageLink, '-') + '_files';
    }

    getImageName(src) {
        const sourceInstance = new URL(src);

        return sourceInstance.host.replace(this.symbolsForReplacingPageLink, '-') + sourceInstance.pathname.replace(this.symbolsForReplacingImageLink, '-');
    }

}


