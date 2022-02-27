import { jsfx } from "../lib/jsfx/index";
import { audioContext, getQuantizedTime } from "./audio";
import { Random } from "./random";
import { times } from "./util";

export type SoundEffect = {
  type: Type;
  params;
  volume: number;
  buffers: AudioBuffer[];
  bufferSourceNodes: AudioBufferSourceNode[];
  gainNode: GainNode;
  isPlaying: boolean;
  playedTime: number;
  isDrum?: boolean;
  seed?: number;
};

export const types = [
  "coin",
  "laser",
  "explosion",
  "powerUp",
  "hit",
  "jump",
  "select",
  "synth",
  "tone",
  "click",
  "random",
] as const;
export type Type = typeof types[number];
const typeFunctionNames = {
  coin: "Coin",
  laser: "Laser",
  explosion: "Explosion",
  powerUp: "PowerUp",
  hit: "Hit",
  jump: "Jump",
  select: "Select",
  synth: "Synth",
  tone: "Tone",
  click: "Click",
  random: "Lucky",
};

const jsfxRandom = new Random();
let soundEffects: SoundEffect[];
let live;

export function init() {
  live = jsfx.Live();
  soundEffects = [];
  jsfx.setRandomFunc(() => jsfxRandom.get());
}

export function play(soundEffect: SoundEffect) {
  playSoundEffect(soundEffect);
}

export function update() {
  const currentTime = audioContext.currentTime;
  soundEffects.forEach((se) => {
    updateSoundEffect(se, currentTime);
  });
}

export function get(
  type: Type,
  seed: number,
  count = 2,
  volume = 0.05,
  freq: number = undefined,
  attackRatio: number = 1,
  sustainRatio: number = 1
): SoundEffect {
  const params = times(count, (i) => {
    jsfxRandom.setSeed(seed + i * 1063);
    const p = jsfx.Preset[typeFunctionNames[type]]();
    if (freq != null && p.Frequency.Start != null) {
      p.Frequency.Start = freq;
    }
    if (p.Volume.Attack != null) {
      p.Volume.Attack *= attackRatio;
    }
    if (p.Volume.Sustain != null) {
      p.Volume.Sustain *= sustainRatio;
    }
    return p;
  });
  return createBuffers(type, params, volume);
}

function createBuffers(type: Type, params, volume: number): SoundEffect {
  const buffers = params.map((p) => {
    const values = live._generate(p);
    const buffer = audioContext.createBuffer(1, values.length, jsfx.SampleRate);
    var channelData = buffer.getChannelData(0);
    channelData.set(values);
    return buffer;
  });
  const gainNode = audioContext.createGain();
  gainNode.gain.value = volume;
  gainNode.connect(audioContext.destination);
  return {
    type,
    params,
    volume,
    buffers,
    bufferSourceNodes: undefined,
    gainNode,
    isPlaying: false,
    playedTime: undefined,
  };
}

export function getForSequence(
  sequence,
  isDrum: boolean,
  seed: number,
  type?: Type,
  volume?: number
) {
  const random = new Random();
  random.setSeed(seed);
  let se: SoundEffect;
  if (isDrum) {
    let t = random.select(["hit", "hit", "click", "click", "explosion"]);
    if (type != null) {
      t = type;
    }
    se = get(
      t,
      random.getInt(999999999),
      t === "explosion" ? 1 : 2,
      volume != null ? volume : t === "explosion" ? 0.04 : 0.05,
      random.get(100, 200),
      t === "explosion" ? 0.5 : 1,
      t === "explosion" ? 0.2 : 1
    );
  } else {
    const al = calcNoteLengthAverage(sequence);
    let t =
      random.get() < 1 / al
        ? "select"
        : random.select(["tone", "tone", "synth"]);
    if (type != null) {
      t = type;
    }
    se = get(
      t,
      random.getInt(999999999),
      t !== "select" ? 1 : 2,
      volume != null
        ? volume
        : t === "tone"
        ? 0.03
        : t === "synth"
        ? 0.04
        : 0.025,
      261.6,
      t !== "select" ? 0.1 : 1,
      t !== "select" ? 2 : 1
    );
  }
  se.isDrum = isDrum;
  se.seed = seed;
  return se;
}

function calcNoteLengthAverage(sequence) {
  let sl = 0;
  sequence.notes.forEach((n) => {
    sl += n.quantizedEndStep - n.quantizedStartStep;
  });
  return sl / sequence.notes.length;
}

export function add(se: SoundEffect) {
  soundEffects.push(se);
}

export function remove(tse: SoundEffect) {
  soundEffects = soundEffects.filter((se) => se !== tse);
}

export function setVolume(soundEffect: SoundEffect, volume: number) {
  soundEffect.gainNode.gain.value = volume;
}

function playSoundEffect(soundEffect: SoundEffect) {
  soundEffect.isPlaying = true;
}

function updateSoundEffect(soundEffect: SoundEffect, currentTime: number) {
  if (!soundEffect.isPlaying) {
    return;
  }
  soundEffect.isPlaying = false;
  const time = getQuantizedTime(currentTime);
  if (soundEffect.playedTime == null || time > soundEffect.playedTime) {
    playLater(soundEffect, time);
    soundEffect.playedTime = time;
  }
}

export function playLater(
  soundEffect: SoundEffect,
  when: number,
  detune: number = undefined
) {
  soundEffect.bufferSourceNodes = [];
  soundEffect.buffers.forEach((b) => {
    const bufferSourceNode = audioContext.createBufferSource();
    bufferSourceNode.buffer = b;
    if (detune != null && bufferSourceNode.playbackRate != null) {
      const semitoneRatio = Math.pow(2, 1 / 12);
      bufferSourceNode.playbackRate.value = Math.pow(semitoneRatio, detune);
    }
    bufferSourceNode.start =
      bufferSourceNode.start || (bufferSourceNode as any).noteOn;
    bufferSourceNode.connect(soundEffect.gainNode);
    bufferSourceNode.start(when);
    soundEffect.bufferSourceNodes.push(bufferSourceNode);
  });
}

export function stop(soundEffect: SoundEffect, when: number = undefined) {
  if (soundEffect.bufferSourceNodes != null) {
    soundEffect.bufferSourceNodes.forEach((n) => {
      if (when == null) {
        n.stop();
      } else {
        n.stop(when);
      }
    });
    soundEffect.bufferSourceNodes = undefined;
  }
}

export function toJson(soundEffect: SoundEffect) {
  return {
    isDrum: soundEffect.isDrum,
    seed: soundEffect.seed,
    type: soundEffect.type,
    volume: soundEffect.volume,
  };
}

export function fromJSON(json, sequence): SoundEffect {
  return getForSequence(
    sequence,
    json.isDrum,
    json.seed,
    json.type,
    json.volume
  );
}
