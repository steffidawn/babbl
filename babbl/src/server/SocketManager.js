const {VERIFY_USER, USER_CONNECTED, LOGOUT} = require('../Events');
const {createUser, createMessage, createChat} = require('../Factories');
const io = require('./index.js').io;
const connectedUser = {};

module.exports = function(socket) {
  console.log("Socket ID: " + socket.id);
  socket.on(VERIFY_USER, (nickname, callback) => {
    if(isUser(connectedUser, nickname)) {
      callback({isUser:true, user:null})
    }else{
      callback({isUser:false, user:createUser({name:nickname})})
    }
  })
}

function addUser(userList, user) {

}

function isUser(userList, username) {

}
