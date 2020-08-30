/* global music_rnn Tone Nexus core music_vae*/

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

// drum instruments
let players = new Tone.Players({
  kick: "https://teropa.info/ext-assets/drumkit/kick.mp3",
  // hatClosed: "https://teropa.info/ext-assets/drumkit/hatClosed.mp3",
  // hatOpen: "https://teropa.info/ext-assets/drumkit/hatOpen2.mp3",
  // snare: "https://teropa.info/ext-assets/drumkit/snare3.mp3",
  tomLow: "https://teropa.info/ext-assets/drumkit/tomLow.mp3",
  tomMid: "https://teropa.info/ext-assets/drumkit/tomMid.mp3",
  tomHigh: "https://teropa.info/ext-assets/drumkit/tomHigh.mp3"
  // ride: "https://teropa.info/ext-assets/drumkit/ride.mp3",
  // crash: "https://teropa.info/ext-assets/drumkit/hatOpen.mp3"
}).toDestination();

let midiToDrum = new Map([
  [36, "kick"],
  // [37, "snare"],
  // [38, "snare"],
  // [40, "snare"],
  // [42, "hatClosed"],
  // [22, "hatClosed"],
  // [44, "hatClosed"],
  // [46, "hatOpen"],
  // [26, "hatOpen"],
  [43, "tomLow"],
  [58, "tomLow"],
  [47, "tomMid"],
  [45, "tomMid"],
  [50, "tomHigh"],
  [48, "tomHigh"]
  // [49, "crash"],
  // [52, "crash"],
  // [55, "crash"],
  // [57, "crash"],
  // [51, "ride"],
  // [53, "ride"],
  // [59, "ride"]
]);
let drumToMidi = new Map([...midiToDrum].map(e => e.reverse()));

// create an instrument for the melody
let leadSampler = new Tone.Sampler({
  urls: {
    E4:
      "https://cdn.glitch.com/423f41f1-4f4a-4017-b4fc-3b0b39eb0328%2F230670__akshaylaya__tha-e-122.wav?v=1598645852409"
    // E3:
    // "https://cdn.glitch.com/423f41f1-4f4a-4017-b4fc-3b0b39eb0328%2F231123__akshaylaya__thom-e-020.wav?v=1598645905841",
    // B3: "https://cdn.glitch.com/423f41f1-4f4a-4017-b4fc-3b0b39eb0328%2F224171__akshaylaya__dheem-b-080.wav?v=1598645899647"
  },
  volume: 2
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

// let drumBeat = [
//   ["0:0:0", "tomLow"],
//   ["0:1:0", "tomHigh"],
//   ["0:1:2", "tomLow"],
//   ["0:2:0", "tomLow"],
//   ["0:3:0", "tomHigh"],
//   ["1:0:0", "tomLow"],
//   ["1:1:0", "tomHigh"],
//   ["1:2:0", "tomLow"],
//   ["1:2:3", "tomLow"],
//   ["1:3:0", "tomHigh"],
//   ["1:3:2", "tomLow"],
//   ["1:3:2", "tomMid"]
// ];

let drumBeat = [
  ["0:0:0", "tomLow"],
  ["0:0:2", "tomHigh"],
  ["0:0:3", "tomLow"],
  ["0:1:0", "tomLow"],
  ["0:1:2", "tomHigh"],
  ["0:2:0", "tomLow"],
  ["0:2:2", "tomHigh"],
  ["0:3:0", "tomLow"],
  ["0:3:2", "tomHigh"],
  ["0:3:3", "tomLow"],
  ["0:3:4", "tomMid"]
];

// let drumPart = new Tone.Part((time, drum) => {
//   players.player(drum).start(time);
//   console.log("started sound");
// }, drumBeat).start();
// // have to manually loop for parts
// drumPart.loop = true;
// drumPart.loopStart = 0;
// drumPart.loopEnd = "1m";

Tone.Transport.scheduleRepeat(time => {
  // use the callback time to schedule events
  console.log("repeat");
  generateMusic();
}, "2m");

// Magenta stuff

//load magenta
let melodyRNN = new music_rnn.MusicRNN(
  "https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv"
);
let melodyRNNLoaded = melodyRNN.initialize();

// Generates a melody
async function generateMusic() {
  console.log("generate music");
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

  let chordProgression = [songKey];

  let result = await melodyRNN.continueSequence(
    seed,
    steps,
    temperature,
    chordProgression
  );
  // console.log(result);

  console.log(seed);
  console.log(result);
  console.log(core.sequences);
  let combined = result;

  let noteNames = [];

  console.log("generated music");
  for (let note of combined.notes) {
    // console.log(note);
    let noteName = Tone.Frequency(note.pitch, "midi").toNote();

    noteNames.push(noteName);

    let column = note.quantizedStartStep;

    /* 4 16th notes = 1n
    4n = 1m */

    let m = Math.floor(column / 16).toString();
    let n = Math.floor((column % 16) / 4).toString();
    let s = Math.floor((column % 16) % 4).toString();

    let time = m + ":" + n + ":" + s;

    leadPart.add(time, noteName);
  }

  console.log(noteNames);
}

// let grooVae = new music_vae.MusicVAE(
//   "https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/groovae_2bar_humanize"
// );
// let grooVaeLoaded = grooVae.initialize();

// async function grooveDrums() {
//   await grooVaeLoaded;

//   let sixteenthNoteTicks = Tone.Time("16n").toTicks();
//   let original = {
//     notes: drumBeat.map(([time, drum]) => ({
//       pitch: drumToMidi.get(drum),
//       quantizedStartStep: Tone.Time(time).toTicks() / sixteenthNoteTicks,
//       quantizedEndStep: Tone.Time(time).toTicks() / sixteenthNoteTicks + 1
//     })),
//     totalQuantizedSteps: 32,
//     quantizationInfo: { stepsPerQuarter: 4 }
//   };

//   let z = await grooVae.encode([original]);
//   let result = await grooVae.decode(
//     z,
//     0.6,
//     undefined,
//     4,
//     Tone.Transport.bpm.value
//   );

//   drumPart.clear();
//   for (let note of result[0].notes) {
//     drumPart.at(note.startTime, midiToDrum.get(note.pitch));
//   }

//   console.log(result);
// }

function changeSound() {
  console.log("sound changed");
  var e = document.getElementById("sounds");
  var soundLink = e.options[e.selectedIndex].value;
  var sound = e.options[e.selectedIndex].label;

  Tone.Transport.stop();

  if (sound == "Mridangam #1 - Tha") {
    leadSampler = new Tone.Sampler({
      urls: {
        E4:
          'https://cdn.glitch.com/423f41f1-4f4a-4017-b4fc-3b0b39eb0328%2F230670__akshaylaya__tha-e-122.wav?v=1598645852409'
      },
      volume: 2
    }).toDestination();
  } else if (sound == "Mridangam #2 - Thom") {
    leadSampler = new Tone.Sampler({
      urls: {
        E3:
          'https://cdn.glitch.com/423f41f1-4f4a-4017-b4fc-3b0b39eb0328%2F231123__akshaylaya__thom-e-020.wav?v=1598645905841'
      },
      volume: 2
    }).toDestination();
  } else if (sound == "Violin") {
    leadSampler = new Tone.Sampler({
      urls: {
        A5:
          "https://cdn.glitch.com/423f41f1-4f4a-4017-b4fc-3b0b39eb0328%2F373750__samulis__solo-violin-vibrato-sustain-a5-llvln-arcovib-a5-p.wav?v=1598579480147"
      },
      volume: 2
    }).toDestination();
  } else if (sound == "Harp") {
    leadSampler = new Tone.Sampler({
      urls: {
        C4:
          "https://cdn.glitch.com/207f429b-3476-40eb-a33a-05bb64ff9656%2F521905__tarane468__12-haugharp-c4.wav?v=1596912821837"
      },
      volume: -12
    }).toDestination();
  }

  Tone.Transport.start();
  generateMusic();
}
