// eslint-disable-next-line import/prefer-default-export
export class NamesGenerator {
    constructor(urlInstance) {
        this.urlInstance = urlInstance;
        this.symbolsForReplacingPageLink = /[.\/]/gm;
        this.symbolsForReplacingImageLink = /[\/]/gm;
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

