/* global ml5 createCanvas createCapture VIDEO width height select image fill noStroke ellipse stroke line
createImg frameRate noLoop strokeWeight round createVideo loadImage background Tone generateMusic imageMode CENTER 
CORNER translate grooveDrums round random p5*/

class DanceNet {
  constructor(link) {
    this.ready = false;

    this.video = createVideo(link);
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

  // A function to draw ellipses over the detected keypoints
  drawKeypoints(poses) {
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
          noStroke();
          fill(255, 0, 0);
          ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
        }
      }
    }
  }

  // A function to draw the skeletons
  drawSkeleton(poses) {
    // console.log("drawSkel");
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
  vidLoad() {
    console.log("vidLoad");
    // this.video.stop();
    this.video.play();
  }
}
