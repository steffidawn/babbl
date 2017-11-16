var element = function(id) {
  return document.getElementById(id);
}

var status = element('status');
var messages = element('messages');
var textarea = element('textarea');
var username = element('username');
var clearchat = element('clearchat');

var statusDefault = status.textContent;

//function to reset message status to '' after 4 sec
var setStatus = function(s) {
  status.textContent = s;
  if(s !== statusDefault) {
    var delay = setTimeout(function() {
      setStatus(statusDefault);
    }, 4000);
  }
}
//Connecting to socket.io
var socket = io.connect('http://127.0.0.1:3000');


if (socket !== undefined) {
  console.log('socket is working as designed.');
  socket.on('output', function(data) {
    if(data.length) {
      for(var i = 0; i < data.length; i++) {
        var message = document.createElement('div');
        message.setAttribute('class', 'chatmessage');
        message.textContent = data[i].name + ": " + data[i].message;
        messages.appendChild(message);
        messages.insertBefore(message, messages.firstChild);
      }
    }
  });
  socket.on('status', function(data){
    setStatus((typeof data === 'object')? data.message : data);
    if(data.clear){
      textarea.value = '';
    }
  });
  textarea.addEventListener('keydown', function(event) {
    if(event.which === 13 && event.shiftKey === false) {
      socket.emit('input', {
        name: username.value,
        message:textarea.value
      });
      event.preventDefault();
    }
  })
  clearchat.addEventListener('click', function() {
    socket.emit('clear');
  });
  socket.on('cleared', function() {
    messages.textContent = '';
  });
}
