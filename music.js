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
    A5:
      "https://cdn.glitch.com/423f41f1-4f4a-4017-b4fc-3b0b39eb0328%2F373750__samulis__solo-violin-vibrato-sustain-a5-llvln-arcovib-a5-p.wav?v=1598579480147"
  },
  volume: +12
}).toDestination();
// leadSampler.debug = true;

// Patterns

let leadPattern = [];
let numNotes = leadPattern.length;

let leadPart = new Tone.Part((time, note) => {
  console.log(note);
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


// Magenta stuff

//load magenta
let melodyRNN = new music_rnn.MusicRNN(
  "https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/chord_pitches_improv"
);
let melodyRNNLoaded = melodyRNN.initialize();

// Generates a melody
async function generateMusic() {
  console.log("generate music")
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
