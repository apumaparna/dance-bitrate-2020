/* global ml5 createCanvas createCapture VIDEO width height select image fill noStroke ellipse stroke line
createImg frameRate noLoop strokeWeight round createVideo loadImage background Tone generateMusic imageMode CENTER 
CORNER translate grooveDrums round random DanceNet floor colorMode HSB RGB color melodyRNNLoaded*/

let bodypix;
let video;
let segmentation;
let img;

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

function preload() {
  bodypix = ml5.bodyPix(options);
}

function setup() {
  let canvas = createCanvas(500, 500);
  canvas.parent("p5sketch");
  // load up your video
  // video = createVideo(
  //   "https://cdn.glitch.com/423f41f1-4f4a-4017-b4fc-3b0b39eb0328%2FThattadavu%20%231_Trim.mp4?v=1598376217969",
  // );

  for (let i = 0; i < vidList.length; i++) {
    let vid = createVideo(vidList[i]);
    vid.hide();
    vid.volume(0);
    elementList.push(vid);
  }

  video = elementList[0];
  video.size(1080 / 3, 1920 / 3);

  // Create a palette - uncomment to test below
  // createHSBPalette();
  // createRGBPalette();
  // createSimplePalette();
  bodypix.segmentWithParts(video, gotResults, options);

  //   video.onended(function(nextVideo) {
  //     console.log("onended function called");

  //     video = random(elementList);

  //     bodypix.segmentWithParts(video, gotResults, options);
  //     vidLoad();
  //   });

  video.hide();

  background(0);
}

function modelReady() {
  if (melodyRNNLoaded) {
    select("#status").html("<b> <i> Model Loaded </b>");
  }
}

function gotResults(err, result) {
  if (err) {
    console.log(err);
    return;
  } 
  
  modelReady(); 

  segmentation = result;

  background(100);

  imageMode(CENTER);
  video.size(1080, 1920);
  image(segmentation.partMask, width / 2, height / 2, 1080 / 3, 1920 / 3);
  video.size(1080 / 3, 1920 / 3);
  imageMode(CORNER);

  bodypix.segmentWithParts(video, gotResults, options);
}

function vidLoad() {
  video.stop();
  video.loop();
}

function createSimplePalette() {
  // options.opacity = 0.2;
  options.palette = bodypix.config.palette;
  Object.keys(options.palette).forEach(part => {
    const r = floor(random(255));
    const g = floor(random(255));
    const b = floor(random(255));
    options.palette[part].color = [r, g, b];
  });
}

function createHSBPalette() {
  colorMode(HSB);
  options.palette = bodypix.config.palette;
  Object.keys(options.palette).forEach(part => {
    const h = floor(random(360));
    const s = floor(random(100));
    const b = floor(random(100));
    const c = color(h, s, b);
    options.palette[part].color = c;
  });
}

function createRGBPalette() {
  colorMode(RGB);
  options.palette = bodypix.config.palette;
  Object.keys(options.palette).forEach(part => {
    const r = floor(random(255));
    const g = floor(random(255));
    const b = floor(random(255));
    const c = color(r, g, b);
    options.palette[part].color = c;
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
  vidLoad();
  generateMusic();
  // grooveDrums();
  Tone.Transport.start();
};

document.getElementById("loop-step").onclick = async () => {
  console.log("loop-step");
  video.stop();

  var e = document.getElementById("steps");
  // console.log(e);
  var step = e.options[e.selectedIndex].value;
  console.log(step);

  let i = vidList.indexOf(step);
  video = elementList[i];

  bodypix.segmentWithParts(video, gotResults, options);
  video.loop();
  console.log("loop started");
};
