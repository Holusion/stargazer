'use strict';

const chai = require('chai')
      , cap = require('chai-as-promised')

chai.config.includeStack = true;

chai.use(cap);
global.expect = chai.expect;
