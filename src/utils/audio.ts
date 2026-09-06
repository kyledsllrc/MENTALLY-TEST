/**
 * Pure Web Audio API ambient sound generator and chime synthesizer.
 * Does not require external audio files or internet access.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  private currentType: string | null = null;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Play gentle bell/singing bowl tone for breath pacing or mindful moments
  playChime(pitch: number = 440) {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.98, this.ctx.currentTime + 1.8);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 2.5);
    } catch (e) {
      console.warn("Audio chime error:", e);
    }
  }

  // Start continuous ambient noise (Rain, Ocean, Forest Wind)
  startAmbiance(type: "rain" | "ocean" | "forest", volume: number = 0.3) {
    this.stopAmbiance();
    this.init();
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    // Pink / Brown noise synthesis
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter based on ambient type
    const filter = this.ctx.createBiquadFilter();
    if (type === "rain") {
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
    } else if (type === "ocean") {
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(400, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.2, this.ctx.currentTime);
    } else {
      // forest wind
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(350, this.ctx.currentTime);
    }

    const masterGain = this.ctx.createGain();
    masterGain.gain.setValueAtTime(volume, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(this.ctx.destination);

    whiteNoise.start();
    this.noiseNode = whiteNoise;
    this.gainNode = masterGain;
    this.isPlaying = true;
    this.currentType = type;
  }

  stopAmbiance() {
    if (this.noiseNode) {
      try {
        (this.noiseNode as AudioScheduledSourceNode).stop();
      } catch (e) {}
      this.noiseNode.disconnect();
      this.noiseNode = null;
    }
    this.isPlaying = false;
    this.currentType = null;
  }

  getPlayingAmbiance() {
    return this.isPlaying ? this.currentType : null;
  }

  setVolume(vol: number) {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
  }
}

export const soundEngine = new SoundEngine();
