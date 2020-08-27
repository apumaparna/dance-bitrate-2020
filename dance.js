/* global ml5 createCanvas createCapture VIDEO width height select image fill noStroke ellipse stroke line
createImg frameRate noLoop strokeWeight round createVideo loadImage background*/

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

let poseList = [];

let playRound = 0;

let video;
var videoIsPlaying;

function setup() {
  videoIsPlaying = true;
  createCanvas(1080, 1920);
  video = createVideo(
    "https://cdn.glitch.com/423f41f1-4f4a-4017-b4fc-3b0b39eb0328%2FThattadavu%20%231_Trim.mp4?v=1598376217969",
    vidLoad
  );
  video.size(width, height);
  // video.noLoop();
  console.log("got video");

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  console.log("defined poseNet");

  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on("pose", function(results) {
    // if (!(Array.isArray(results) && results.length)) {
    poses = results;
    // }
    // console.log(results);
  });
  console.log("filled array with poses");
  // Hide the video element, and just show the canvas
  video.hide();

  // video.onended(async function(stopVideo) {
  //   console.log("video over");
  //   poses = [];
  //   console.log(poses);
  // });

  // console.log(poses);
}

// async function(stopVid) {

// }

function modelReady() {
  select("#status").html("Model Loaded");
}

// function mousePressed() {
//   vidLoad();
// }

function draw() {
  console.log("draw");
  background(255);
  // console.log("playRound");
  // console.log(playRound);
  console.log(videoIsPlaying);
  // image(video, 0, 0, width, height);

  // console.log(poses);

  // We can call both functions to draw all keypoints and the skeletons
  // if (videoIsPlaying == true) {
  // if (videoIsPlaying) {
  drawKeypoints();
  drawSkeleton();
  // } else {
  // poseNet.off("pose", results => {
  // do something with the results

  // console.log(results);
  // noLoop();
  // throw "game over";
  // });
  // }
  // }

  console.log(poseList);
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  console.log("drawKeypoints");
  // Loop through all the poses detected
  // console.log(poses);
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    console.log(pose);
    poseList.push(pose);
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        // console.log(keypoint.position.x);
        // console.log(keypoint.position.y);
        noStroke();
        fill(255, 0, 0);
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  console.log("drawSkeleton");
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
  videoIsPlaying = true;
  video.play();
  // videoIsPlaying = false;
  // window.stop();
}

// function keyPressed() {
//   if (videoIsPlaying) {
//     video.pause();
//     videoIsPlaying = false;
//   } else {
//     video.loop();
//     videoIsPlaying = true;
//   }
// }
