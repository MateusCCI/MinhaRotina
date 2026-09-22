import { useState, useEffect, useCallback, useRef } from 'react';
import DatabaseSingleton from '../src/lib/database';

export interface TimerState {
  elapsed: number;
  remaining: number;
  running: boolean;
}

interface UseTimerOptions {
  prefix: string;
  totalMs?: number;
  onComplete?: () => void;
}

export function useTimer({ prefix, totalMs = 25 * 60 * 1000, onComplete }: UseTimerOptions) {
  const [state, setState] = useState<TimerState>({ elapsed: 0, remaining: totalMs, running: false });
  const total = totalMs;
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  const tick = useCallback(() => {
    setState(prev => {
      const elapsed = prev.elapsed + (Date.now() - startRef.current);
      const remaining = Math.max(0, total - elapsed);
      if (remaining === 0 && onComplete) {
        onComplete();
      }
      return { elapsed, remaining, running: true };
    });
    rafRef.current = requestAnimationFrame(tick);
  }, [total, onComplete]);

  const start = useCallback(async () => {
    const now = Date.now();
    startRef.current = now;
    setState(prev => {
      const from = prev.elapsed > 0 ? prev.elapsed : 0;
      return { elapsed: from, remaining: Math.max(0, total - from), running: true };
    });
    try {
      const db = await DatabaseSingleton.getInstance();
      await db.saveTimerState(prefix, 0, true, now);
    } catch (error) {
      console.error('Erro ao iniciar timer:', error);
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [prefix, total, tick]);

  const pause = useCallback(async () => {
    if (!state.running) return;
    const now = Date.now();
    const finalElapsed = state.elapsed + (now - startRef.current);
    setState({ elapsed: finalElapsed, remaining: Math.max(0, total - finalElapsed), running: false });
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    try {
      const db = await DatabaseSingleton.getInstance();
      await db.saveTimerState(prefix, finalElapsed, false, null);
    } catch (error) {
      console.error('Erro ao pausar timer:', error);
    }
  }, [state, total, prefix]);

  const reset = useCallback(async () => {
    setState({ elapsed: 0, remaining: total, running: false });
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    try {
      const db = await DatabaseSingleton.getInstance();
      await db.clearTimerState(prefix);
    } catch (error) {
      console.error('Erro ao zerar timer:', error);
    }
    if (onComplete) onComplete();
  }, [prefix, total, onComplete]);

  useEffect(() => {
    let cancelled = false;
    DatabaseSingleton.getInstance()
      .then(db => db.getTimerState(prefix))
      .then(saved => {
        if (cancelled || !saved) return;
        startRef.current = saved.startedAt ?? Date.now();
        setState({
          elapsed: saved.elapsedMs,
          remaining: Math.max(0, total - saved.elapsedMs),
          running: saved.running,
        });
        if (saved.running) {
          rafRef.current = requestAnimationFrame(tick);
        }
      })
      .catch(error => console.error('Erro ao carregar timer:', error));
    return () => {
      cancelled = true;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [prefix]);

  return { ...state, start, pause, reset };
}

export function formatMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
}