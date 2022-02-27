import { init as initAudio } from "./audio";
import * as soundEffect from "./soundEffect";
import * as part from "./part";
import * as player from "./player";
import * as generator from "./generator";
import { cloneDeep } from "./util";
import { Random } from "./random";

const seedRandom = new Random();
let originPlayer: player.Player;
let generatedPlayer: player.Player;
let progressBar: HTMLDivElement;
let generatedStepsCountTextInput: HTMLInputElement;

const defaultGeneratedNotesStepsCount = 64;

function update() {
  requestAnimationFrame(update);
  part.update();
  soundEffect.update();
}

async function generate(seed: number) {
  const random = new Random(seed);
  player.stop(generatedPlayer);
  player.stop(originPlayer);
  let generatedNotesStepsCount = Number.parseInt(
    generatedStepsCountTextInput.value
  );
  if (
    Number.isNaN(generatedNotesStepsCount) ||
    generatedNotesStepsCount < 4 ||
    generatedNotesStepsCount > 256
  ) {
    generatedNotesStepsCount = defaultGeneratedNotesStepsCount;
    generatedStepsCountTextInput.value = `${generatedNotesStepsCount}`;
  }
  generatedPlayer.generatedNotesStepsCount = generatedNotesStepsCount;
  const tracks = originPlayer.tracks;
  const melodySequences = [];
  const drumSequences = [];
  let tmpDrumSequences = [];
  const drumTrackCounts = [];
  tracks.forEach((t) => {
    if (t.soundEffect.isDrum) {
      tmpDrumSequences.push(cloneDeep(t.sequence));
      if (tmpDrumSequences.length === 4) {
        drumSequences.push(
          generator.drumSequencesToPitchSequence(tmpDrumSequences)
        );
        drumTrackCounts.push(4);
        tmpDrumSequences = [];
      }
    } else {
      melodySequences.push(cloneDeep(t.sequence));
    }
  });
  if (tmpDrumSequences.length > 0) {
    drumSequences.push(
      generator.drumSequencesToPitchSequence(tmpDrumSequences)
    );
    drumTrackCounts.push(tmpDrumSequences.length);
  }
  let generatedMelodySequences = await generator.generate(
    random.getInt(999999999),
    melodySequences,
    2,
    0.99,
    true,
    false,
    generatedNotesStepsCount,
    progressBar
  );
  let generatedDrumPitchSequences = await generator.generate(
    random.getInt(999999999),
    drumSequences,
    2,
    0.99,
    false,
    true,
    generatedNotesStepsCount,
    progressBar
  );
  let generatedDrumSequences = generatedDrumPitchSequences
    .map((dp, i) =>
      generator.pitchSequenceToDrumSequences(dp, drumTrackCounts[i])
    )
    .flat();
  generatedMelodySequences = generatedMelodySequences.filter(
    (s) => s.notes.length > 0
  );
  generatedDrumSequences = generatedDrumSequences.filter(
    (s) => s.notes.length > 0
  );
  const generatedSequences = generatedMelodySequences.concat(
    generatedDrumSequences
  );
  player.setTrackCount(generatedPlayer, generatedSequences.length);
  player.setTrackSoundEffects(
    generatedPlayer,
    generatedSequences.map((s, i) =>
      soundEffect.getForSequence(
        s,
        i >= generatedMelodySequences.length,
        random.getInt(999999999)
      )
    )
  );
  player.setSequences(generatedPlayer, generatedSequences);
  progressBar.textContent = "Done.";
  progressBar.style.width = "100%";
  player.play(generatedPlayer);
  saveToStorage();
}

const generatedStepsCountStorageKey = "ggg_steps_count";
const generatedPlayerStorageKey = "ggg_generated";
const originPlayerStorageKey = "ggg_origin";

function saveToStorage() {
  try {
    localStorage.setItem(
      generatedStepsCountStorageKey,
      generatedStepsCountTextInput.value
    );
    localStorage.setItem(
      generatedPlayerStorageKey,
      generatedPlayer.stateTextInput.value
    );
    localStorage.setItem(
      originPlayerStorageKey,
      originPlayer.stateTextInput.value
    );
  } catch (e) {
    console.log(e);
  }
}

function loadFromStorage() {
  try {
    const stepsCount = localStorage.getItem(generatedStepsCountStorageKey);
    generatedStepsCountTextInput.value =
      stepsCount == null ? `${defaultGeneratedNotesStepsCount}` : stepsCount;
    const generatedPlayerJson = localStorage.getItem(generatedPlayerStorageKey);
    if (generatedPlayerJson != null) {
      player.fromJSON(generatedPlayer, JSON.parse(generatedPlayerJson));
      generatedPlayer.stateTextInput.value = generatedPlayerJson;
    }
    const originPlayerJson = localStorage.getItem(originPlayerStorageKey);
    if (originPlayerJson != null) {
      player.fromJSON(originPlayer, JSON.parse(originPlayerJson));
      originPlayer.stateTextInput.value = originPlayerJson;
    } else {
      setDefaultMml();
    }
  } catch (e) {
    console.log(e);
    setDefaultMml();
  }
}

const defaultTracks = [
  { mml: "l16 o4 r>c2. r8c r<a+2. r8a+", isDrum: false },
  { mml: "l16 o4 fc+fg8c8g8 c8fgcfg fcfg8c8f8 c8ffcfg", isDrum: false },
  { mml: "l16 o4 crrr crrr crrr crrr crrr crrr crrr crrr", isDrum: true },
  { mml: "l16 o4 rrrr crrr rrrr crrr rrrr crrr rrrr crrr", isDrum: true },
  { mml: "l16 o4 rcrr rrrc rcrr rrrr rcrr rrrc rcrr rrrr", isDrum: true },
  { mml: "l16 o4 rrcr rrcr rrcr rrcr rrcr rrcr rrcr rrcr", isDrum: true },
];

function setDefaultMml() {
  player.setTrackCount(originPlayer, defaultTracks.length);
  player.setSequencesFromMmlStrings(
    originPlayer,
    defaultTracks.map((t) => t.mml)
  );
  player.setTrackSoundEffects(
    originPlayer,
    defaultTracks.map((t, i) =>
      soundEffect.getForSequence(originPlayer.tracks[i].sequence, t.isDrum, 1)
    )
  );
  player.setPartsAndVisualizers(originPlayer);
}

function init() {
  initAudio();
  soundEffect.init();
  generator.init();
  generatedPlayer = player.get(document.getElementById("main"), () => {
    player.stop(originPlayer);
    player.playStopToggle(generatedPlayer);
    saveToStorage();
  });
  originPlayer = player.get(document.getElementById("main"), () => {
    player.stop(generatedPlayer);
    player.playStopToggle(originPlayer);
    saveToStorage();
  });
  document.getElementById("generate").addEventListener("click", () => {
    const seed = seedRandom.getInt(999999999);
    setTimeout(() => generate(seed), 0);
  });
  generatedStepsCountTextInput = document.getElementById(
    "generated_steps_count"
  ) as HTMLInputElement;
  progressBar = document.getElementById("progress_bar") as HTMLDivElement;
  loadFromStorage();
  update();
}

window.addEventListener("load", init);
