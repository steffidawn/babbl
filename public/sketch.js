var socket;

function setup() {
  createCanvas(400, 400);
  background(51);

  socket = io.connect('http://localhost:3000');
  socket.on('mouse', newDrawing);
}

function newDrawing(data) {
  noStroke();
  fill(65, 205, 140);
  ellipse(data.x, data.y, 36, 36);
}

function mouseDragged() {
  console.log(mouseX + ',' + mouseY);
  var data = {
    x: mouseX,
    y: mouseY
  }
  socket.emit('mouse', data);
  noStroke();
  fill(130, 120, 200);
  ellipse(mouseX, mouseY, 36, 36);

}

// function draw() {
//
// }
