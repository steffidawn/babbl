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
});

//Connecting to mongo
mongo.connect('mongodb://127.0.0.1/mongochat', function(err, db){
    if(err){
        throw err;
    }
    console.log('connected to mongo')
    //Connecting to socket.io
    io.on('connection', function(socket) {
      let chat = db.collection('chats');
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
        let name = data.name;
        let message = data.message;

        if(name === '' || message === '') {
          sendStatus('Please enter a babl name and message.')
        } else {
          //if user provided name and message, insert chat into db
          chat.insert({name: name, message: message}, function() {
            client.emit('output', [data]);
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
});

app.get('/', function(req, res){
    // var element = function(id) {
    //   return document.getElementById(id);
    // }
    //
    // var status = element('status');
    // var messages = element('messages');
    // var textarea = element('textarea');
    // var username = element('username');
    // var clearchat = element('clearchat');
    //
    // var statusDefault = status.textContent;
    //
    // //function to reset message status to '' after 4 sec
    // var setStatus = function(s) {
    //   status.textContent = s;
    //   if(s !== statusDefault) {
    //     var delay = setTimeout(function() {
    //       setStatus(statusDefault);
    //     }, 4000);
    //   }
    // }
    // //Connecting to socket.io
    // var socket = io.connect('http://127.0.0.1:4000');
    //
    // //check connection
    // if (socket !== undefined) {
    //   console.log('socket is working as designed.');
    //   socket.on('output', function(data) {
    //     if(data.length) {
    //       for(var i = 0; i < data.length; i++) {
    //         var message = document.createElement('div');
    //         message.setAttribute('class', 'chatmessage');
    //         message.textContent = data[i].name + ": " + data[i].message;
    //         messages.appendChild(message);
    //         messages.insertBefore(message, messages.firstChild);
    //       }
    //     }
    //   });
    //   socket.on('status', function(data){
    //     setStatus((typeof data === 'object')? data.message : data);
    //     if(data.clear){
    //       textarea.value = '';
    //     }
    //   });
    //   textarea.addEventListener('keydown', function(event) {
    //     if(event.which === 13 && event.shiftKey === false) {
    //       socket.emit('input', {
    //         name: username.value,
    //         message:textarea.value
    //       });
    //       event.preventDefault();
    //     }
    //   })
    //   clearchat.addEventListener('click', function() {
    //     socket.emit('clear');
    //   });
    //   socket.on('cleared', function() {
    //     messages.textContent = '';
    //   });
    // }
    // function setup() {
    //   createCanvas(400, 400);
    // }
    // function draw() {
    //   background(51);
    //   ellipse(mouseX, mouseY, 60, 60);
    // }
  res.render('index');
});


//
// const mongo = require('mongodb').MongoClient;
// const client = require('socket.io').listen(4000).sockets;
// const express = require('express');
// const app = express();
//
// app.use(express.static('public'));
//
// // Connecting to mongo
// mongo.connect('mongodb://127.0.0.1/mongochat', function(err, db){
//     if(err){
//         throw err;
//     }
//     console.log('connected to mongo')
//     //Connecting to socket.io
//     client.on('connection', function(socket) {
//       let chat = db.collection('chats');
//       //Sending status from backend to front end via socket.emit
//       sendStatus = function(s) {
//         socket.emit('status', s);
//       }
//       chat.find().limit(100).sort({_id:1}).toArray(function(err, res) {
//         if(err) {
//           throw err;
//         }
//         //emitting messages
//         socket.emit('output', res);
//       });
//
//       //handle input events
//       socket.on('input', function(data) {
//         let name = data.name;
//         let message = data.message;
//
//         if(name === '' || message === '') {
//           sendStatus('Please enter a babl name and message.')
//         } else {
//           //if user provided name and message, insert chat into db
//           chat.insert({name: name, message: message}, function() {
//             client.emit('output', [data]);
//             sendStatus({
//               message:'babbl sent',
//               clear: true
//             });
//           });
//         }
//       });
//       //Handle clear messages - changing to saving later
//       socket.on('clear', function(data) {
//         chat.remove({}, function() {
//           socket.emit('cleared');
//         });
//       });
//     });
// });
