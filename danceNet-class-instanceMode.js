/* global ml5 createCanvas createCapture VIDEO width height select image fill noStroke ellipse stroke line
createImg frameRate noLoop strokeWeight round createVideo loadImage background Tone generateMusic imageMode CENTER 
CORNER translate grooveDrums round random p5*/

class DanceNetInstance {
  constructor(video) {
    this.ready = false;

    this.video = video;
    console.log("created video");
    this.video.size(1080 / 3, 1920 / 3);
    this.video.volume(0);

    // Create a new poseNet method with a single detection
    this.poseNet = ml5.poseNet(this.video);

    this.ready = true;
    console.log(this.ready);

    // Hide the video element, and just show the canvas
    this.video.hide();
  }

  getReady() {
    return this.ready;
  }
  
  getPoseNet() {
    return this.poseNet; 
  }


  // This function is called when the video loads
  vidLoad() {
    console.log("vidLoad");
    // this.video.stop();
    this.video.play();
  }
}
