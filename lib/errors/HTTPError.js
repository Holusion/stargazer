const {ErrorWrapper} = require('./ErrorWrapper');

class HTTPError extends ErrorWrapper {
    constructor(statusCode, message) {
        super(`HTTPError: ${statusCode}`, new Error(message))
    }

    get statusCode() {return this.statusCode}
}

module.exports = {HTTPError}