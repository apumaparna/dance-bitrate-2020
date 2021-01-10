/* global ml5 createCanvas createCapture VIDEO width height select image fill noStroke ellipse stroke line
createImg frameRate noLoop strokeWeight round createVideo loadImage background Tone generateMusic imageMode CENTER 
CORNER translate grooveDrums round random DanceNet p5 DanceNetInstance*/

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

let sketch2Ready = false; 

var s1 = function(sketch) {
  sketch.setup = function() {
    let canvas1 = sketch.createCanvas(500, 500);
    canvas1.parent("p5sketch");

    sketch.background(0);

    for (let i = 0; i < vidList.length; i++) {
      classList.push(new DanceNetInstance(sketch.createVideo(vidList[i])));
    }

    console.log(classList);

    currentClass = classList[0];
    // console.log("currentClass")
    // console.log(currentClass);
    video = currentClass.video;
    modelReady(sketch);
    currentClass.poseNet.on("pose", callback);
  };
  sketch.draw = function() {
    //for canvas 1
    sketch.background(0);

    console.log("currentClass");
    console.log(currentClass);

    sketch.imageMode(sketch.CENTER);
    video.size(1080, 1920);
    sketch.image(
      video,
      sketch.width / 2,
      sketch.height / 2,
      1080 / 3,
      1920 / 3
    );
    video.size(1080 / 3, 1920 / 3);

    sketch.imageMode(sketch.CORNER);

    sketch.translate(
      (sketch.width - 1080 / 3) / 2,
      (sketch.height - 1920 / 3) / 2
    );
    // console.log("poses");
    // console.log(poses);
    drawKeypoints(poses, sketch);
    drawSkeleton(poses, sketch);

    video.onended(function(nextVideo) {
      console.log("onended function called");
      currentClass.poseNet.removeListener("pose", callback);

      currentClass = sketch.random(classList);
      video = currentClass.video;

      currentClass.poseNet.on("pose", callback);
      currentClass.vidLoad();
    });
  };
};

// create a new instance of p5 and pass in the function for sketch 1
new p5(s1);


var s2 = function(sketch) {
  let video;
  let poseNet;
  let poses = [];

  sketch.setup = function() {
    let canvas2 = sketch.createCanvas(500, 500);
    canvas2.parent("webcam");

    video = sketch.createCapture(sketch.VIDEO);
    video.size(500, 500);

    // Create a new poseNet method with a single detection
    poseNet = ml5.poseNet(video, function(){
      sketch2Ready = true; 
    });
    // This sets up an event that fills the global variable "poses"
    // with an array every time new poses are detected
    poseNet.on("pose", function(results) {
      poses = results;
    });
    // Hide the video element, and just show the canvas
    video.hide();
  };
  sketch.draw = function() {
    console.log("poseNet webcam is running");
    sketch.image(video, 0, 0, sketch.width, sketch.height);

    // We can call both functions to draw all keypoints and the skeletons
    drawKeypoints(poses, sketch);
    drawSkeleton(poses, sketch);
  };
};

// create the second instance of p5 and pass in the function for sketch 2
new p5(s2);


function callback(results) {
  poses = results;
  console.log("poses");
  console.log(poses);
}

function modelReady(sketch) {
  let ready = true;

  for (let i = 0; i < classList.length; i++) {
    ready = ready && classList[i].getReady();
  }

  if (ready && sketch2Ready) {
    sketch.select("#status").html("<b> <i> Model Loaded </b>");
  }
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

document.getElementById("loop-step").onclick = async () => {
  console.log("loop-step");
  video.stop();
  currentClass.poseNet.removeListener("pose", callback);

  var e = document.getElementById("steps");
  // console.log(e);
  var step = e.options[e.selectedIndex].value;
  console.log(step);

  let i = vidList.indexOf(step);
  currentClass = classList[i];
  console.log(currentClass);
  video = currentClass.video;

  currentClass.poseNet.on("pose", callback);
  video.loop();
  console.log("loop started");
};

document.getElementById("generate-step").onclick = async () => {
  console.log("generate-step");

  video.stop();
  currentClass.poseNet.removeListener("pose", callback);

  currentClass = random(classList);
  video = currentClass.video;

  currentClass.poseNet.on("pose", callback);
  currentClass.vidLoad();
};

function drawKeypoints(poses, sketch) {
  // console.log("drawKeypoints");
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    console.log("pose");
    console.log(pose);
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        sketch.noStroke();
        sketch.fill(255, 0, 0);
        sketch.ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

function drawSkeleton(poses, sketch) {
  // console.log("drawSkel");
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      sketch.stroke(255, 0, 0);
      sketch.line(
        partA.position.x,
        partA.position.y,
        partB.position.x,
        partB.position.y
      );
    }
  }
}
