const app = require('express');
const http = require('http').Server(app);

// app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('<h1>babbl</h1>');
});

http.listen(3000, function() {
  console.log('listening on 3000');
});
