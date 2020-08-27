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
    // console.log(poses);
    poseList.push(poses);
  }
  console.log(poseList);
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

// Now that we have the array, let's draw it out

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  console.log("drawKeypoints");
  // Loop through all the poses detected
  for (let h = 0; h < poseList.length; h++) {
    let frame = poseList[h];
    // background(0);
    for (let i = 0; i < frame.length; i++) {
      // For each pose detected, loop through all the keypoints
      let pose = frame[i].pose;
      console.log(pose);
      for (let j = 0; j < pose.keypoints.length; j++) {
        // A keypoint is an object describing a body part (like rightArm or leftShoulder)
        let keypoint = pose.keypoints[j];
        // Only draw an ellipse is the pose probability is bigger than 0.2
        if (keypoint.score > 0.2) {
          setTimeout( () => {
          noStroke();
          fill(255, 0, 0);
          ellipse(keypoint.position.x, keypoint.position.y, 10, 10); }, 10); 
        }
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  console.log("drawSkeleton");
  // Loop through all the skeletons detected
  for (let h = 0; h < poseList.length; h++) {
    let frame = poseList[h];
    // background(0);
    for (let i = 0; i < frame.length; i++) {
      let skeleton = frame[i].skeleton;
      // For every skeleton, loop through all body connections
      for (let j = 0; j < skeleton.length; j++) {
        let partA = skeleton[j][0];
        let partB = skeleton[j][1];

        setTimeout(() => {
          stroke(255, 0, 0);
          line(
            partA.position.x,
            partA.position.y,
            partB.position.x,
            partB.position.y
          );
        }, 10);
      }
    }
  }
}

function draw() {
  background(0);
  if (!go) {
    // frameRate(2)
    setTimeout(drawKeypoints(), 1000);
    setTimeout(drawSkeleton(), 1000);
  }
}
