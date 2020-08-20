/* global music_rnn Tone Nexus core*/

// create an instrument for the melody
let leadSampler = new Tone.Sampler({
  urls: {
    C2:
      "https://cdn.glitch.com/207f429b-3476-40eb-a33a-05bb64ff9656%2F521905__tarane468__12-haugharp-c4.wav?v=1596912821837"
  },
  volume: -8
}).toDestination();

// Patterns

let leadPattern = [];
let numNotes = leadPattern.length; 

let leadPart = new Tone.Part((time, note) => {
  leadSampler.triggerAttackRelease(note, "2n", time);
}, leadPattern).start();
leadPart.loop = true;
leadPart.loopStart = 0;
leadPart.loopEnd = "2m";

Tone.Transport.scheduleRepeat((time) => {
	// use the callback time to schedule events
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
        pitch: Tone.Frequency("C#3").toMidi(),
        quantizedStartStep: 0,
        quantizedEndStep: 4
      }
    ],
    totalQuantizedSteps: 4,
    quantizationInfo: { stepsPerQuarter: 4 }
  };

  let steps = 28;

  let temperature = 1.2;

  let chordProgression = ["C#m7"];

  let result = await melodyRNN.continueSequence(
    seed,
    steps,
    temperature,
    chordProgression
  );
  console.log(result);

  let combined = core.sequences.concatenate([seed, result]);
  console.log(combined);

  sequencer.matrix.populate.all([0]);
  for (let note of combined.notes) {
    let column = note.quantizedStartStep;
    let noteName = Tone.Frequency(note.pitch, "midi").toNote();
    let row = sequencerRows.indexOf(noteName);
    if (row >= 0) {
      sequencer.matrix.set.cell(column, row, 1);
    }
  }
}

document.getElementById("generate-melody").onclick = async () => {
  await melodyRNNLoaded;

  let seed = {
    notes: [
      {
        pitch: Tone.Frequency("C#3").toMidi(),
        quantizedStartStep: 0,
        quantizedEndStep: 4
      }
    ],
    totalQuantizedSteps: 4,
    quantizationInfo: { stepsPerQuarter: 4 }
  };

  let steps = 28;

  let temperature = 1.2;

  let chordProgression = ["C#m7"];

  let result = await melodyRNN.continueSequence(
    seed,
    steps,
    temperature,
    chordProgression
  );
  console.log(result);

  let combined = core.sequences.concatenate([seed, result]);
  console.log(combined);

  sequencer.matrix.populate.all([0]);
  for (let note of combined.notes) {
    let column = note.quantizedStartStep;
    let noteName = Tone.Frequency(note.pitch, "midi").toNote();
    let row = sequencerRows.indexOf(noteName);
    if (row >= 0) {
      sequencer.matrix.set.cell(column, row, 1);
    }
  }
};
