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

/**
 * Modelo do tempo: dois valores, e a conta é feita **fora** do acumulador.
 *
 * `baseRef` guarda o tempo já consumido por segmentos anteriores (congelado
 * enquanto pausado) e `startRef` marca quando começou o segmento atual. O
 * elapsed de agora é `base + (agora - início)`.
 *
 * A versão anterior somava dentro do acumulador —
 * `prev.elapsed + (Date.now() - startRef.current)` — o que **conta o tempo
 * duas vezes**: a cada quadro o decorado inteiro desde o início voltava a ser
 * somado por cima do que já tinha sido acumulado. O resultado era um relógio
 * quadrático, que acelerava sem parar (25 min acabavam em segundos). Só
 * apareceu medindo: nenhum teste olhava o relógio por tempo suficiente para
 * o desvio aparecer.
 */
export function useTimer({ prefix, totalMs = 25 * 60 * 1000, onComplete }: UseTimerOptions) {
  const [state, setState] = useState<TimerState>({ elapsed: 0, remaining: totalMs, running: false });
  /**
   * A duração mora numa ref, e não direto no estado. Motivo: `total` entrava
   * nas dependências do `tick` e do efeito de hidratação, então trocar a
   * preferência reidratava do banco e podia iniciar **duas** RAFs competindo
   * (ciclo de 3 segundos). Quem muda a duração em uso chama `setTotalMs`, que
   * zera o ciclo de propósito.
   */
  const totalRef = useRef(totalMs);
  const total = totalRef.current;
  const rafRef = useRef<number | null>(null);
  /** Tempo consumido antes do segmento atual. */
  const baseRef = useRef(0);
  /** Instante em que o segmento atual começou (0 quando pausado). */
  const startRef = useRef(0);
  /** Garante que o aviso de fim de bloco dispare uma vez só por ciclo. */
  const firedRef = useRef(false);
  /** Callback numa ref: o `tick` não recria a cada render por causa dele. */
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const stopRaf = (): void => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const persist = useCallback(async (elapsedMs: number, running: boolean, startedAt: number | null) => {
    try {
      const db = await DatabaseSingleton.getInstance();
      await db.saveTimerState(prefix, elapsedMs, running, startedAt);
    } catch (error) {
      console.error('Erro ao salvar timer:', error);
    }
  }, [prefix]);

  const tick = useCallback(() => {
    const elapsed = baseRef.current + (Date.now() - startRef.current);
    const remaining = Math.max(0, totalRef.current - elapsed);

    if (remaining === 0) {
      // O raf precisa parar aqui: mantendo o loop, o `onComplete` disparava a
      // cada quadro (~60x/s) e o timer nunca saía de "rodando".
      stopRaf();
      if (!firedRef.current) {
        firedRef.current = true;
        baseRef.current = elapsed;
        startRef.current = 0;
        setState({ elapsed, remaining: 0, running: false });
        void persist(elapsed, false, null);
        onCompleteRef.current?.();
      }
      return;
    }

    setState({ elapsed, remaining, running: true });
    rafRef.current = requestAnimationFrame(tick);
  }, [persist]);

  const start = useCallback(async () => {
    const now = Date.now();
    // Retoma de onde parou. A versão anterior gravava sempre 0, então
    // "Continuar" depois de pausar voltava do zero.
    baseRef.current = state.elapsed;
    startRef.current = now;
    firedRef.current = false;
    setState(prev => ({ ...prev, running: true }));
    await persist(state.elapsed, true, now);
    rafRef.current = requestAnimationFrame(tick);
  }, [state.elapsed, tick, persist]);

  const pause = useCallback(async () => {
    if (!state.running) return;
    const finalElapsed = baseRef.current + (Date.now() - startRef.current);
    baseRef.current = finalElapsed;
    startRef.current = 0;
    setState({ elapsed: finalElapsed, remaining: Math.max(0, totalRef.current - finalElapsed), running: false });
    stopRaf();
    await persist(finalElapsed, false, null);
  }, [state.running, persist]);

  const reset = useCallback(async () => {
    baseRef.current = 0;
    startRef.current = 0;
    // Zerar NÃO é terminar o bloco: antes daqui chamava `onComplete`, então
    // apertar "Zerar" disparava o aviso de fim de bloco.
    firedRef.current = true;
    setState({ elapsed: 0, remaining: totalRef.current, running: false });
    stopRaf();
    try {
      const db = await DatabaseSingleton.getInstance();
      await db.clearTimerState(prefix);
    } catch (error) {
      console.error('Erro ao zerar timer:', error);
    }
  }, [prefix, persist]);

  /**
   * Troca a duração do bloco. Zera o ciclo em andamento: mudar a régua no
   * meio do caminho só faria sentido se o app mentisse sobre o progresso já
   * percorrido. Também apaga o estado salvo, senão a próxima abertura
   * reidrataria o ciclo antigo com a régua nova.
   */
  const setTotalMs = useCallback(
    async (nextTotalMs: number) => {
      totalRef.current = nextTotalMs;
      baseRef.current = 0;
      startRef.current = 0;
      firedRef.current = true;
      stopRaf();
      setState({ elapsed: 0, remaining: nextTotalMs, running: false });
      try {
        const db = await DatabaseSingleton.getInstance();
        await db.clearTimerState(prefix);
      } catch (error) {
        console.error('Erro ao ajustar duração do timer:', error);
      }
    },
    [prefix]
  );

  useEffect(() => {
    let cancelled = false;
    DatabaseSingleton.getInstance()
      .then(db => db.getTimerState(prefix))
      .then(saved => {
        if (cancelled || !saved) return;
        baseRef.current = saved.elapsedMs;
        startRef.current = saved.running ? saved.startedAt ?? Date.now() : 0;
        const elapsed = baseRef.current + (Date.now() - startRef.current);
        setState({
          elapsed,
          remaining: Math.max(0, totalRef.current - elapsed),
          running: saved.running,
        });
        if (saved.running) {
          rafRef.current = requestAnimationFrame(tick);
        }
      })
      .catch(error => console.error('Erro ao carregar timer:', error));
    return () => {
      cancelled = true;
      stopRaf();
    };
  }, [prefix, tick]);

  return { ...state, totalMs: total, start, pause, reset, setTotalMs };
}

export function formatMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':');
}