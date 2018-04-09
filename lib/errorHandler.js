'use strict';

function parseError(err) {
  const lines = err.stack.split(/\r\n|\r|\n/);
  // at ClientRequest.req.on (/home/yann/Documents/stargazer/lib/Upload.js:63)
  const stackRegex = /\s*at\s+([\w\.\_]+)\s+\(([/\w\_\.]+):(\d+):(\d+)\)/
  let content = [];

  lines.forEach((line) => {
    if(stackRegex.test(line)) {
      let parts = stackRegex.exec(line);
      content.push({
        context: parts[1],
        file: parts[2],
        line: parts[3],
        column: parts[4]
      })
    }
  })

  return {title: lines[0], content: content};
}

module.exports = {parseError}
