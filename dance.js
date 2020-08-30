/* global ml5 createCanvas createCapture VIDEO width height select image fill noStroke ellipse stroke line
createImg frameRate noLoop strokeWeight round createVideo loadImage background Tone generateMusic imageMode CENTER 
CORNER translate grooveDrums round random DanceNet*/

// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

// PoseNet with a pre-recorded video, modified from:
// https://github.com/ml5js/ml5-examples/blob/master/p5js/PoseNet/sketch.js

// let poseNet;
let poses = [];

let video;
let currentClass;

let vidList = [
  "https://cdn.glitch.com/423f41f1-4f4a-4017-b4fc-3b0b39eb0328%2FThattadavu%20%231_Trim.mp4?v=1598376217969",
  "https://cdn.glitch.com/423f41f1-4f4a-4017-b4fc-3b0b39eb0328%2FEttu%20Adavu%20%231_Trim.mp4?v=1598650839527",
  "https://cdn.glitch.com/423f41f1-4f4a-4017-b4fc-3b0b39eb0328%2FMandi%20Adavu%20%2309_Trim.mp4?v=1598651232743",
  "https://cdn.glitch.com/423f41f1-4f4a-4017-b4fc-3b0b39eb0328%2FTeermana%20Adavu%20(Alapadma)%20%235_Trim.mp4?v=1598721946974",
  "https://cdn.glitch.com/423f41f1-4f4a-4017-b4fc-3b0b39eb0328%2FPakk%20Adavu%20%233_Trim.mp4?v=1598721957764",
  "https://cdn.glitch.com/423f41f1-4f4a-4017-b4fc-3b0b39eb0328%2FNattadavu%20%238_Trim.mp4?v=1598721958503",
  "https://cdn.glitch.com/423f41f1-4f4a-4017-b4fc-3b0b39eb0328%2FKudita%20mettu%20adavu%20%234_Trim.mp4?v=1598721962747",
  "https://cdn.glitch.com/423f41f1-4f4a-4017-b4fc-3b0b39eb0328%2FJarkadavu%20%233_Trim.mp4?v=1598721971451"
];

let classList = [];

function setup() {
  let canvas = createCanvas(500, 500);
  canvas.parent("p5sketch");
  
  background(0);

  for (let i = 0; i < vidList.length; i++) {
    classList.push(new DanceNet(vidList[i]));
  }

  console.log(classList);

  currentClass = classList[0];
  console.log(currentClass);
  video = currentClass.video;
  modelReady();
  currentClass.poseNet.on("pose", callback);
}

function callback(results) {
  poses = results;
}

function modelReady() {
  let ready = true;

  for (let i = 0; i < classList.length; i++) {
    ready = ready && classList[i].getReady();
  }

  if (ready) {
    select("#status").html("<b> <i> Model Loaded </b>");
  }
}

function draw() {
  background(0);

  imageMode(CENTER);
  video.size(1080, 1920);
  image(video, width / 2, height / 2, 1080 / 3, 1920 / 3);
  video.size(1080 / 3, 1920 / 3);

  imageMode(CORNER);

  translate((width - 1080 / 3) / 2, (height - 1920 / 3) / 2);
  currentClass.drawKeypoints(poses);
  currentClass.drawSkeleton(poses);

  video.onended(function(nextVideo) {
    console.log("onended function called");
    currentClass.poseNet.removeListener("pose", callback);

    currentClass = random(classList);
    video = currentClass.video;

    currentClass.poseNet.on("pose", callback);
    currentClass.vidLoad();
  });
}

document.getElementById("stop").onclick = async () => {
  console.log("button");
  // stop the loop
  video.stop();
  console.log("video stop line has been played");
  Tone.Transport.stop();
};

document.getElementById("start").onclick = async () => {
  console.log("button");
  await Tone.start();
  currentClass.vidLoad();
  generateMusic();
  // grooveDrums();
  Tone.Transport.start();
};
