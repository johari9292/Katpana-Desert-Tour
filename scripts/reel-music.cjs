const fs = require("node:fs");

// An original, deterministic instrumental bed. No samples or external services.
function createMusic(filename, seconds = 12, seed = 0) {
  const rate = 44100;
  const samples = Math.ceil(rate * seconds);
  const wav = Buffer.alloc(44 + samples * 2);
  wav.write("RIFF"); wav.writeUInt32LE(36 + samples * 2, 4);
  wav.write("WAVEfmt ", 8); wav.writeUInt32LE(16, 16);
  wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
  wav.writeUInt32LE(rate, 24); wav.writeUInt32LE(rate * 2, 28);
  wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34);
  wav.write("data", 36); wav.writeUInt32LE(samples * 2, 40);
  const chords = [[48, 55, 60, 64], [45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59]];
  const melody = [72, 76, 79, 76, 69, 72, 76, 72, 65, 69, 72, 69, 67, 71, 74, 71];
  const transpose = seed ? (seed % 5) - 2 : 0;
  const tempo = seed ? 0.65 + (seed % 20) / 100 : 0.75;
  const hz = (midi) => 440 * 2 ** ((midi + transpose - 69) / 12);
  for (let i = 0; i < samples; i++) {
    const t = i / rate;
    const phrase = (t % (tempo * 16)) / (tempo * 4);
    const chord = chords[(Math.floor(phrase) + seed % 4) % 4];
    const padEnvelope = Math.min(1, (phrase % 1) * 8, (1 - phrase % 1) * 8);
    let value = chord.reduce((sum, note) => sum + Math.sin(2 * Math.PI * hz(note) * t), 0) * 0.045 * padEnvelope;
    const beat = t % tempo;
    const note = melody[(Math.floor(t / tempo) + seed % melody.length) % melody.length];
    value += Math.sin(2 * Math.PI * hz(note) * t) * Math.exp(-beat * 6) * 0.10;
    const pulse = t % (tempo * 2);
    value += Math.sin(2 * Math.PI * (55 * pulse + 6 * (1 - Math.exp(-pulse * 25)))) * Math.exp(-pulse * 15) * 0.10;
    const fade = Math.max(0, Math.min(1, t / 0.5, (seconds - t) / 1.2));
    wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, value * fade)) * 32767), 44 + i * 2);
  }
  fs.writeFileSync(filename, wav);
  return filename;
}

module.exports = { createMusic };
