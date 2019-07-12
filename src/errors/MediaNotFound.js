const {ErrorWrapper} = require('./ErrorWrapper');

class MediaNotFound extends ErrorWrapper {
    constructor(media) {
        super(`MediaNotFoundError: ${media}`, new Error(`${media} was not found`));
    }

    get media() {
        return this.media;
    }
}

module.exports = {MediaNotFound};