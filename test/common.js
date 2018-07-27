'use strict';

const chai = require('chai')
      , cap = require('chai-as-promised')
      , spies = require('chai-spies')

chai.config.includeStack = true;

chai.use(cap);
chai.use(spies);

global.expect = chai.expect;
global.sandbox = chai.spy.sandbox;
