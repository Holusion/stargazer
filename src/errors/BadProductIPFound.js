const {ErrorWrapper} = require('./ErrorWrapper');

class BadProductIPFound extends ErrorWrapper {

    constructor(id, addr) {
        super(`BadProductIPFound: ${id}:${addr}`, new Error(`L'IP du produit "${id}" n'est pas valide (${addr}), la configuration réseau du produit ou le produit en lui même sont peut-être défectueux`))
    }
}

module.exports = {BadProductIPFound}