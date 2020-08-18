/* global createCanvas windowWidth windowHeight colorMode HSB noStroke background
resizeCanvas width height*/

let backgroundColor, canvas; 

function setup() {
  canvas = createCanvas(windowWidth*0.80, windowHeight*0.80);
  // var x = (windowWidth - width) / 2;
  // var y = (windowHeight - height) / 2;
  // cnv.position(x, y);
  // cnv.style('display', 'block');
  
  canvas.parent('sketch-holder');
  
  colorMode(HSB, 360, 100, 100);
  noStroke();
  
  backgroundColor = 30; 
}

function draw() {
  background(backgroundColor); 
}

function windowResized() {
  resizeCanvas(windowWidth*0.80, windowHeight*0.80);
}

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  canvas.position(x, y);
}