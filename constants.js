'use strict';

const path = require('path')

let constant = module.exports;

constant.WIN_DATA_PATH = process.env.APPDATA
constant.MACOS_DATA_PATH = process.env.HOME + '/Library/Preferences'
constant.LINUX_DATA_PATH = process.env.HOME + '/.local/share'

constant.DATA_PATH = path.join(constant.WIN_DATA_PATH || (process.platform == 'darwin' ? constant.MACOS_DATA_PATH : constant.LINUX_DATA_PATH), 'stargazer');