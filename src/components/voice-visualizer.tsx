import { useEffect, useRef } from "react";
import { getAnalyser } from "@/lib/speech/engine";
import { useSpeechStatus } from "@/lib/speech/use-speech-status";

function readColor(name: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

/**
 * Mirrored bar spectrum that follows the voice and rests as a quiet line when
 * idle. A server voice drives it from real audio; the device voice has no
 * stream to read, so it draws a soft synthetic wave instead.
 * Adapted from Natural Voice Reader's visualizer.
 */
export function VoiceVisualizer({ bars = 56, className }: { bars?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { speaking } = useSpeechStatus();
  const activeRef = useRef(speaking);
  activeRef.current = speaking;
  const kickRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (speaking) kickRef.current();
  }, [speaking]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const levels = new Float32Array(bars);
    let raf = 0;
    let width = 0;
    let height = 0;
    let colors = { a: "#ffb547", b: "#ff5f8f", track: "#6b7186" };
    let bins = new Uint8Array(128);

    const refreshColors = () => {
      colors = {
        a: readColor("--color-accent", colors.a),
        b: readColor("--color-glow", colors.b),
        track: readColor("--color-track", colors.track),
      };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      const live = activeRef.current;
      const node = getAnalyser();

      if (live && node) {
        if (bins.length !== node.frequencyBinCount) bins = new Uint8Array(node.frequencyBinCount);
        node.getByteFrequencyData(bins);
        // Speech lives in the lower bins; spread those across the bars, mirrored from the center.
        const usable = Math.floor(bins.length * 0.6);
        for (let i = 0; i < bars; i++) {
          const fromCenter = Math.abs(i - (bars - 1) / 2) / ((bars - 1) / 2);
          const bin = Math.min(usable - 1, Math.floor(fromCenter * usable));
          const v = (bins[bin] ?? 0) / 255;
          levels[i] = levels[i] * 0.55 + v * 0.45;
        }
      } else if (live) {
        const t = time / 1000;
        for (let i = 0; i < bars; i++) {
          const x = i / bars;
          const envelope = Math.sin(Math.PI * x) ** 0.7;
          const v =
            envelope *
            (0.42 +
              0.26 * Math.sin(t * 5.2 + x * 9) * Math.sin(t * 1.7 + x * 3) +
              0.16 * Math.sin(t * 11 + x * 23));
          levels[i] = levels[i] * 0.7 + Math.max(0.05, v) * 0.3;
        }
      } else {
        for (let i = 0; i < bars; i++) levels[i] = levels[i] * 0.86;
      }

      ctx.clearRect(0, 0, width, height);
      const gap = Math.max(2, Math.min(4, width / bars / 4));
      const barW = Math.max(2, (width - gap * (bars - 1)) / bars);
      const mid = height / 2;
      const grad = ctx.createLinearGradient(0, 0, width, 0);
      grad.addColorStop(0, colors.a);
      grad.addColorStop(0.5, colors.b);
      grad.addColorStop(1, colors.a);

      let settled = true;
      for (let i = 0; i < bars; i++) {
        const level = levels[i];
        if (level > 0.01) settled = false;
        const h = Math.max(3, level * (height * 0.92));
        const x = i * (barW + gap);
        const r = Math.min(barW / 2, h / 2);
        ctx.fillStyle = level > 0.015 ? grad : colors.track;
        ctx.globalAlpha = level > 0.015 ? 0.55 + level * 0.45 : 0.35;
        ctx.beginPath();
        ctx.roundRect(x, mid - h / 2, barW, h, r);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if ((live && !reduced) || !settled) raf = requestAnimationFrame(draw);
      else raf = 0;
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };
    kickRef.current = kick;

    refreshColors();
    resize();
    kick();

    const ro = new ResizeObserver(() => {
      resize();
      kick();
    });
    ro.observe(canvas);
    // Theme or accent changes swap the CSS variables on <html>.
    const mo = new MutationObserver(() => {
      refreshColors();
      kick();
    });
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "data-ink"],
    });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
    };
  }, [bars]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
