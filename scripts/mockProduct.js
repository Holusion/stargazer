
var mdns    = require('mdns')
    ,express = require('express');

var app = express();
app.get('/', function(req, res){
  res.send('Hello World');
});

let startPort = 4321;
let nbTest = parseInt(process.argv[2]);

for(let i = startPort; i < startPort + nbTest; i++) {
  let listener = app.listen(i, function() {
    let port = listener.address().port;
    mdns.createAdvertisement(mdns.tcp('workstation') , port, {name: `test${startPort-i}`}).start();
    console.log('Listening on port', port);
  });
}
