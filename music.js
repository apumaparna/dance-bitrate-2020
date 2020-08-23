/* global music_rnn Tone Nexus core*/

// Tone.Transport.bpm.value = 220;

// Determine the key
let songKey = "C";
let starterNote = "C";

let flag = false;

function readKey() {
  var e = document.getElementById("keys");
  var key = e.options[e.selectedIndex].value;
  // console.log(key)
  starterNote = key;
  return key;
}

function readMajorMinor() {
  var radios = document.getElementsByName("choice");

  for (var i = 0, length = radios.length; i < length; i++) {
    if (radios[i].checked) {
      // do whatever you want with the checked radio
      if (radios[i].value == "minor") {
        return "m";
      } else {
        return "";
      }

      // only one radio can be logically checked, don't check the rest
      break;
    }
  }
}

function flatToSharp(note) {
  switch (note) {
    case "Bb":
      return "A#";
    case "Db":
      return "C#";
    case "Eb":
      return "D#";
    case "Gb":
      return "F#";
    case "Ab":
      return "G#";
    default:
      return note;
  }
}

function key() {
  songKey = flatToSharp(readKey()) + readMajorMinor();
  console.log(songKey);
  console.log(starterNote);
  console.log(songKey + "7");
}

// create an instrument for the melody
let leadSampler = new Tone.Sampler({
  urls: {
    C2:
      "https://cdn.glitch.com/207f429b-3476-40eb-a33a-05bb64ff9656%2F521905__tarane468__12-haugharp-c4.wav?v=1596912821837"
  },
  volume: -8
}).toDestination();
// leadSampler.debug = true; 

// Patterns

let leadPattern = [];
let numNotes = leadPattern.length;

let leadPart = new Tone.Part((time, note) => {
  leadSampler.triggerAttackRelease(note, "2n", time);
}, leadPattern).start();
leadPart.loop = true;
leadPart.loopStart = 0;
leadPart.loopEnd = "2m";

Tone.Transport.scheduleRepeat(time => {
  // use the callback time to schedule events
  console.log("repeat");
  generateMusic();
}, "2m");

// Interactions

// start click hander
document.getElementById("start").onclick = async () => {
  console.log("button clicked");
  await Tone.start();
  // start the loop
  generateMusic();
  Tone.Transport.start();
};

// stop click hander
document.getElementById("stop").onclick = async () => {
  console.log("button clicked");
  // stop the loop
  Tone.Transport.stop();
};

// The sequencer is going to help build the melody
let sequencer = new Nexus.Sequencer("#sequencer", {
  columns: 32,
  rows: 12,
  size: [550, 200]
});

new Tone.Loop(time => {
  // Use the draw schedule to make sure the visualization matches up with the audio
  Tone.Draw.schedule(() => sequencer.next(), time);
}, "16n").start();
let sequencerRows = [
  "B3",
  "G#3",
  "E3",
  "C#3",
  "B2",
  "G#2",
  "E2",
  "C#2",
  "B1",
  "G#1",
  "E1",
  "C#1"
];
sequencer.on("change", ({ column, row, state }) => {
  let time = { "16n": column };
  let note = sequencerRows[row];
  if (state) {
    leadPart.add(time, note);
  } else {
    leadPart.remove(time, note);
  }
});

let xPattern = [];
// let xPattern = [
//   ["0:0:0", "C3"],
//   ["1:0:0", "D3"],
//   ["0:0:0", "C3"],
//   ["0:1:0", "C3"],
//   ["0:2:0", "C3"],
//   ["0:3:0", "E3"],
//   ["1:0:0", "G3"],
//   ["1:1:0", "E3"],
//   ["1:1:2", "A#3"],
//   ["1:2:0", "C3"],
//   ["1:2:2", "E3"],
//   ["1:3:2", "A3"],
//   ["1:3:3", "A3"]
// ];
let xPart = new Tone.Part((time, note) => {
  leadSampler.triggerAttackRelease(note, "2n", time);
}, xPattern).start();
xPart.loop = true;
xPart.loopStart = 0;
xPart.loopEnd = "2m";



// Magenta stuff

//load magenta
let melodyRNN = new music_rnn.MusicRNN(
  "https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv"
);
let melodyRNNLoaded = melodyRNN.initialize();

// Generates a melody
async function generateMusic() {
  await melodyRNNLoaded;

  let seed = {
    notes: [
      {
        pitch: Tone.Frequency(starterNote + "3").toMidi(),
        quantizedStartStep: 0,
        quantizedEndStep: 4
      }
    ],
    totalQuantizedSteps: 4,
    quantizationInfo: { stepsPerQuarter: 4 }
  };

  let steps = 28;

  let temperature = 1.2;

  let chordProgression = [songKey + "7"];

  let result = await melodyRNN.continueSequence(
    seed,
    steps,
    temperature,
    chordProgression
  );
  // console.log(result);

  let combined = core.sequences.concatenate([seed, result]);
  // console.log(combined);

  sequencer.matrix.populate.all([0]);
  
  let noteNames = []
  
  console.log("generated music")
  for (let note of combined.notes) {
    // console.log(note);
    let noteName = Tone.Frequency(note.pitch, "midi").toNote();
    
    noteNames.push(noteName); 

    let column = note.quantizedStartStep;
    // let time = { "16n": column };

    // ["0:0:0"];
    /* 4 16th notes = 1n
    4n = 1m */

    let m = Math.floor(column / 16).toString();
    let n = Math.floor((column % 16) / 4).toString();
    let s = Math.floor((column % 16) % 4).toString();

    let time = m + ":" + n + ":" + s;

    // xPattern.push([time, noteName]);
    // console.log(xPattern);
    // console.log(numNotes);

    // leadSampler.triggerAttackRelease(noteName, "2n", time).toDestination;

    // Tone.Transport.schedule(time => {
    //   console.log(noteName)
    //   console.log(note.quantizedEndStep - note.quantizedStartStep);
    //   leadSampler
    //     .triggerAttackRelease(
    //       noteName,
    //       "2n",
    //        note.quantizedStartStep
    //     )
    //     .toDestination();
    // });

    leadPart.add(time, noteName);
    // console.log(leadPart);

    // sequencer
    // let column = note.quantizedStartStep;
    // let noteName = Tone.Frequency(note.pitch, "midi").toNote();
    // let row = sequencerRows.indexOf(noteName);
    // if (row >= 0) {
    //   sequencer.matrix.set.cell(column, row, 1);
    // }
  }
  
  console.log(noteNames); 
}

