/* global ml5 grooveDrums DanceNet melodyRNNLoaded p5 Tone generateMusic*/

const options = {
  multiplier: 0.75, // 1.0, 0.75, or 0.50, 0.25
  outputStride: 8, // 8, 16, or 32, default is 16
  segmentationThreshold: 0.5, // 0 - 1, defaults to 0.5
  palette: {
    leftFace: {
      id: 0,
      color: [110, 64, 170]
    },
    rightFace: {
      id: 1,
      color: [110, 64, 170]
    },
    rightUpperLegFront: {
      id: 2,
      color: [100, 81, 196]
    },
    rightLowerLegBack: {
      id: 3,
      color: [100, 81, 196]
    },
    rightUpperLegBack: {
      id: 4,
      color: [100, 81, 196]
    },
    leftLowerLegFront: {
      id: 5,
      color: [75, 113, 221]
    },
    leftUpperLegFront: {
      id: 6,
      color: [75, 113, 221]
    },
    leftUpperLegBack: {
      id: 7,
      color: [75, 113, 221]
    },
    leftLowerLegBack: {
      id: 8,
      color: [75, 113, 221]
    },
    rightFeet: {
      id: 9,
      color: [40, 163, 220]
    },
    rightLowerLegFront: {
      id: 10,
      color: [100, 81, 196]
    },
    leftFeet: {
      id: 11,
      color: [29, 188, 205]
    },
    torsoFront: {
      id: 12,
      color: [26, 199, 194]
    },
    torsoBack: {
      id: 13,
      color: [26, 210, 182]
    },
    rightUpperArmFront: {
      id: 14,
      color: [28, 219, 169]
    },
    rightUpperArmBack: {
      id: 15,
      color: [28, 219, 169]
    },
    rightLowerArmBack: {
      id: 16,
      color: [28, 219, 169]
    },
    leftLowerArmFront: {
      id: 17,
      color: [51, 240, 128]
    },
    leftUpperArmFront: {
      id: 18,
      color: [51, 240, 128]
    },
    leftUpperArmBack: {
      id: 19,
      color: [51, 240, 128]
    },
    leftLowerArmBack: {
      id: 20,
      color: [51, 240, 128]
    },
    rightHand: {
      id: 21,
      color: [115, 246, 91]
    },
    rightLowerArmFront: {
      id: 22,
      color: [28, 219, 169]
    },
    leftHand: {
      id: 23,
      color: [155, 243, 88]
    }
  }
};

let mainSketch; 
let ready1 = false; 
let ready2 = false; 

var s1 = function(sketch) {
  
  mainSketch = sketch; 
  
  let bodypix;
  let video;
  let segmentation;
  let img;

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

  let elementList = [];

  sketch.preload = function() {
    bodypix = ml5.bodyPix(options);
    console.log("preload");
  };

  sketch.setup = function() {
    // Set the p5Instance so that ml5 knows which instance to use
    ml5.p5Utils.setP5Instance(sketch);

    let canvas = sketch.createCanvas(500, 500);
    canvas.parent("p5sketch");

    for (let i = 0; i < vidList.length; i++) {
      let vid = sketch.createVideo(vidList[i]);
      vid.hide();
      vid.volume(0);
      elementList.push(vid);
    }

    console.log(vidList.length);

    video = elementList[0];
    video.size(1080 / 3, 1920 / 3);
    video.hide();

    bodypix = ml5.bodyPix(video, modelReady);

    sketch.background(0);
  };

  function modelReady() {
    // sketch.select("#status").html("<b> <i> Model Loaded </b>");
    ready1 = true; 
    // bodypix.segmentWithParts(video, gotResults, options);
    globalModelReady(); 
  }

  function gotResults(err, result) {
    if (err) {
      console.log(err);
      return;
    }

    modelReady();

    segmentation = result;

    sketch.background(0);

    sketch.imageMode(sketch.CENTER);
    video.size(1080, 1920);
    sketch.image(
      segmentation.partMask,
      sketch.width / 2,
      sketch.height / 2,
      1080 / 3,
      1920 / 3
    );
    video.size(1080 / 3, 1920 / 3);
    sketch.imageMode(sketch.CORNER);

    bodypix.segmentWithParts(video, gotResults, options);
  }

  function vidLoad() {
    video.stop();

    var e = document.getElementById("steps");
    // console.log(e);
    var step = e.options[e.selectedIndex].value;
    console.log(step);

    let i = vidList.indexOf(step);
    video = elementList[i];

    bodypix.segmentWithParts(video, gotResults, options);
    video.loop();
  }

  document.getElementById("stop").onclick = async () => {
    console.log("button");
    // stop the loop
    video.stop();
    console.log("video stop line has been played");
    Tone.Transport.stop();

    sketch.background(0);
  };

  document.getElementById("start").onclick = async () => {
    console.log("button");
    await Tone.start();
    vidLoad();
    generateMusic();
    // grooveDrums();
    Tone.Transport.start();
  };

  document.getElementById("loop-step").onclick = async () => {
    console.log("loop-step");
    vidLoad();
    console.log("loop started");
  };
};

// create a new instance of p5 and pass in the function for sketch 1
new p5(s1);

var s2 = function(sketch) {
  let bodypix;
  let video;
  let segmentation;

  sketch.setup = function() {
    let canvas2 = sketch.createCanvas(500, 500);
    canvas2.parent("webcam");

    // Set the p5Instance so that ml5 knows which instance to use
    ml5.p5Utils.setP5Instance(sketch);

    // load up your video
    video = sketch.createCapture(sketch.VIDEO);
    video.size(sketch.width, sketch.height);
    video.hide(); // Hide the video element, and just show the canvas
    bodypix = ml5.bodyPix(video, modelReady);
  };
  function modelReady() {
    ready2 = true; 
    globalModelReady(); 
    bodypix.segmentWithParts(video, gotResults, options);
  }

  function gotResults(err, result) {
    if (err) {
      console.log(err);
      return;
    }

    segmentation = result;

    sketch.background(0);

    sketch.image(segmentation.partMask, 0, 0, sketch.width, sketch.height);

    bodypix.segmentWithParts(video, gotResults, options);
  }
};

// create the second instance of p5 and pass in the function for sketch 2
new p5(s2);


function globalModelReady(){
  "globalModelReady"
  if (ready1 && ready2) {
    mainSketch.select("#status").html("<b> <i> Model Loaded </b>");
  }
}