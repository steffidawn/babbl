const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongo = require('mongodb').MongoClient;

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname,'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Listening to port 3000
http.listen(3000, function(){
  console.log('listening on Port 3000');
});

io.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('mouse', mouseMsg);
  function mouseMsg(data) {
    //sending only other users canvas data to client
    socket.broadcast.emit('mouse', data);
    //option to show all users canvas data on client's canvas
    // io.sockets.emit('mouse', data);
    console.log(data);
  }
});

//Connecting to mongo
var db = null;
mongo.connect('mongodb://127.0.0.1/mongochat', function(err, db){
    if(err){
        throw err;
    }
    console.log('connected to mongo')
    db = db;
});

app.get('/', function(req, res){
  res.render('index');
});

//Connecting to socket.io
io.on('connection', function(socket) {

  //Sending status from backend to front end via socket.emit
  sendStatus = function(s) {
    socket.emit('status', s);
  }
  chat.find().limit(100).sort({_id:1}).toArray(function(err, res) {
    if(err) {
      throw err;
    }
    //emitting messages
    socket.emit('output', res);
  });

  //handle input events
  socket.on('input', function(data) {
    let chat = db.collection('chats');
    let name = data.name;
    let message = data.message;

    if(name === '' || message === '') {
      sendStatus('Please enter a babl name and message.')
    } else {
      //if user provided name and message, insert chat into db
      chat.insert({name: name, message: message}, function() {
        socket.emit('output', [data]);
        sendStatus({
          message:'babbl sent',
          clear: true
        });
      });
    }
  });
  //Handle clear messages - changing to saving later
  socket.on('clear', function(data) {
    chat.remove({}, function() {
      socket.emit('cleared');
    });
  });
});
