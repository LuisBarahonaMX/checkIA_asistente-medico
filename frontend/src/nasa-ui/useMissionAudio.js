import { useCallback, useEffect, useRef } from 'react';

// Original synthesized interface sounds. No third-party audio assets required.
export function useMissionAudio() {
  const ctxRef = useRef(null);
  const ambientRef = useRef(null);

  const getContext = useCallback(() => {
    if (!ctxRef.current) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) ctxRef.current = new AudioContextClass();
    }
    return ctxRef.current;
  }, []);

  const beep = useCallback((frequency = 640, duration = 0.09, volume = 0.035) => {
    const ctx = getContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') void ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(Math.max(volume, 0.0002), ctx.currentTime + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration + 0.02);
  }, [getContext]);

  const selectSound = useCallback(() => beep(620, 0.075), [beep]);
  const nextSound = useCallback(() => { beep(530, 0.08); window.setTimeout(() => beep(790, 0.10), 85); }, [beep]);
  const finishSound = useCallback(() => { [523, 659, 784].forEach((f, i) => window.setTimeout(() => beep(f, 0.24, 0.027), i * 135)); }, [beep]);

  // Ambient drone with a very low level, not a licensed music recording.
  const startAmbient = useCallback(async (volume = 0.012) => {
    const ctx = getContext();
    if (!ctx || ambientRef.current) return;
    if (ctx.state === 'suspended') await ctx.resume();
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(ctx.destination);
    const oscillators = [110, 164.81, 220].map((frequency, index) => {
      const osc = ctx.createOscillator();
      osc.type = index === 1 ? 'sine' : 'triangle';
      osc.frequency.value = frequency;
      osc.connect(gain);
      osc.start();
      return osc;
    });
    gain.gain.linearRampToValueAtTime(Math.max(0, Math.min(volume, 0.025)), ctx.currentTime + 1.8);
    ambientRef.current = { gain, oscillators };
  }, [getContext]);

  const stopAmbient = useCallback(() => {
    const ctx = ctxRef.current;
    const ambient = ambientRef.current;
    if (!ctx || !ambient) return;
    ambientRef.current = null;
    ambient.gain.gain.cancelScheduledValues(ctx.currentTime);
    ambient.gain.gain.setValueAtTime(Math.max(ambient.gain.gain.value, 0.0001), ctx.currentTime);
    ambient.gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
    ambient.oscillators.forEach((osc) => osc.stop(ctx.currentTime + 0.4));
    window.setTimeout(() => { try { ambient.gain.disconnect(); } catch {} }, 500);
  }, []);

  useEffect(() => () => {
    const ambient = ambientRef.current;
    if (ambient) ambient.oscillators.forEach(osc => { try { osc.stop(); } catch {} });
    if (ctxRef.current) void ctxRef.current.close();
  }, []);

  return { startAmbient, stopAmbient, selectSound, nextSound, finishSound };
}
