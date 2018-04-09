'use strict';

var errorHandler = require("../lib/errorHandler");

describe("ErrorHandler", () => {
  describe(".parseError()", () => {
    it("Error", (done) => {
      let res = errorHandler.parseError(new Error('toto'));
      expect(res).to.have.property('title');
      expect(res).to.have.property('content');
      expect(res.title).to.equal('Error: toto');
      expect(res.content).to.be.an('array');
      expect(res.content[0]).to.have.property('context');
      expect(res.content[0]).to.have.property('file');
      expect(res.content[0]).to.have.property('line');
      expect(res.content[0]).to.have.property('column');
      expect(res.content[0].context).to.equal('Context.it');
      expect(res.content[0].file).to.equal(__dirname + "/test_errorHandler.js");
      done();
    })

    it("not an Error", (done) => {
      try {
        errorHandler.parseError({code: 200, message: 'OK'});
      } catch(err) {
        done();
      }
    })
  })
})
