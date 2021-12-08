export default class NamesGenerator {
    constructor(urlInstance) {
        this.urlInstance = urlInstance;
        this.symbolsForReplacingPageLink = /[.\/]/gm;
        this.symbolsForReplacingImageLink = /[\/]/gm;
    }

    getPageName() {
        const name = `${this.urlInstance.hostname}${this.urlInstance.pathname}`;
        return `${name.replace(this.symbolsForReplacingPageLink, '-')}.html`;
    }

    getFolderName() {
        const name = `${this.urlInstance.hostname}${this.urlInstance.pathname}`;
        return `${name.replace(this.symbolsForReplacingPageLink, '-')}_files`;
    }

    getImageName(src) {
        const sourceInstance = new URL(src);

        return sourceInstance.host.replace(this.symbolsForReplacingPageLink, '-') + sourceInstance.pathname.replace(this.symbolsForReplacingImageLink, '-');
    }
}
