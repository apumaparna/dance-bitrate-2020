/* global ml5 createCanvas createCapture VIDEO width height select image fill noStroke ellipse stroke line
createImg frameRate noLoop strokeWeight round createVideo loadImage background Tone generateMusic imageMode CENTER 
CORNER translate grooveDrums round random*/

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

let poseNet;
let poses = [];

let video, videoCopy;

var videoIsPlaying;

let vidList = [
  "https://cdn.glitch.com/423f41f1-4f4a-4017-b4fc-3b0b39eb0328%2FThattadavu%20%231_Trim.mp4?v=1598376217969",
  "https://cdn.glitch.com/423f41f1-4f4a-4017-b4fc-3b0b39eb0328%2FEttu%20Adavu%20%231_Trim.mp4?v=1598650839527",
  "https://cdn.glitch.com/423f41f1-4f4a-4017-b4fc-3b0b39eb0328%2FMandi%20Adavu%20%2309_Trim.mp4?v=1598651232743"
];

// let go = true;

let callback = function(results) {
  // if (go) {
  poses = results;
};

function vidPoseSetup(vid) {
  video = createVideo(vid); 
  console.log("created video");
  video.size(1080 / 3, 1920 / 3);
  video.volume(0);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);

  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on("pose", callback);

  // Hide the video element, and just show the canvas
  video.hide();
}

function setup() {
  videoIsPlaying = false;
  createCanvas(500, 500);
  // createCanvas(1080/3, 1920/3);
  vidPoseSetup(vidList[0]);
}

function modelReady() {
  select("#status").html("Model Loaded");
}

function draw() {
  background(0);

  imageMode(CENTER);
  video.size(1080, 1920);
  // image(video, width / 2, height / 2, 1080 / 3, 1920 / 3);
  video.size(1080 / 3, 1920 / 3);

  imageMode(CORNER);

  translate((width - 1080 / 3) / 2, (height - 1920 / 3) / 2);
  drawKeypoints();
  drawSkeleton();

  video.onended(function(nextVideo) {
    console.log("onended function called");
    let vid = random(vidList); 

    poseNet.removeListener("pose", callback);
    // throw "game over!";
    // go = false;

    vidPoseSetup(vid);
    vidLoad();
  });
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        noStroke();
        fill(255, 0, 0);
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(
        partA.position.x,
        partA.position.y,
        partB.position.x,
        partB.position.y
      );
    }
  }
}

// This function is called when the video loads
function vidLoad() {
  console.log("vidLoad");
  video.stop();
  video.play();
  videoIsPlaying = true;
}

document.getElementById("stop").onclick = async () => {
  console.log("button");
  // stop the loop
  videoIsPlaying = false;
  video.stop();
  console.log("video stop line has been played");
  Tone.Transport.stop();
};

document.getElementById("start").onclick = async () => {
  console.log("button");
  await Tone.start();
  vidLoad();
  generateMusic();
  // grooveDrums();
  Tone.Transport.start();
};
