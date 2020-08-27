/* global ml5 createCanvas createCapture VIDEO width height select image fill noStroke ellipse stroke line
createImg frameRate noLoop strokeWeight round createVideo loadImage background*/

let poseNet;
let poses = [];
let lastPoses = [];

let poseList = [];

let video;
var videoIsPlaying;

let go = true;

let callback = function(results) {
  if (go) {
    poses = results;
    console.log(poses);
  }
};

function setup() {
  createCanvas(1080, 1920);
  video = createVideo(
    "https://cdn.glitch.com/423f41f1-4f4a-4017-b4fc-3b0b39eb0328%2FThattadavu%20%231_Trim.mp4?v=1598376217969",
    vidLoad
  );
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);

  poseNet.on("pose", callback);

  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  select("#status").html("Model Loaded");
}

// This function is called when the video loads
function vidLoad() {
  video.stop();
  console.log("video play");
  video.play();
  video.onended(function(stopVideo) {
    console.log("onended function called");
    poseNet.removeListener("pose", callback);
    // throw "game over!";
    go = false;
  });
}


