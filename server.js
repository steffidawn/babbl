const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;

// Connecting to mongo
mongo.connect('mongodb://127.0.0.1/mongochat', function(err, db){
    if(err){
        throw err;
    }
    console.log('connected to mongo')
    //Connecting to socket.io
    client.on('connection', function(socket) {
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
