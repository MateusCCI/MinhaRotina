'use client'
import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * useTimer — Timer persistente por data (localStorage)
 *
 * Conceito:
 *   "Hook" (gancho) = função React que "gancha" estado e efeitos.
 *   Aqui usamos localStorage para que o timer sobreviva recarregamentos
 *   de página e retome automaticamente ao reabrir no mesmo dia.
 *
 * Comportamento:
 *   - Ao montar: lê timer salvo para HOJE; se existir e estiver rodando,
 *     calcula tempo decorrido desde `startedAt` e reinicia o relógio.
 *   - Ao iniciar: grava { startedAt, elapsed } com chave `{prefix}:timer:{YYYY-MM-DD}`.
 *   - Ao parar: lê valor atualizado e grava apenas o acumulador (`elapsed`).
 *   - Ao zerar: apaga a chave do localStorage.
 *   - Ao trocar de data: começa zerado (timer acumulado do dia anterior é
 *     salvo; no novo dia o relógio zera visualmente).
 *
 * Propriedades:
 *   - prefix (string): identificador da tarefa, ex. "estudos", "projeto-x".
 *     Usado na chave do localStorage para isolar timers diferentes.
 *   - onComplete (callback?): disparado quando o timer atinge 0 após um reset.
 *
 * Observação (jargão: "callback" = função que você passa e eu chamo
 * quando algo acontece — aqui, quando o timer completa).
 */
export interface TimerState {
  /** Tempo decorrido no dia atual, em milissegundos */
  elapsed: number
  /** Tempo restante para completar a tarefa, em ms */
  remaining: number
  /** Se o timer está rodando */
  running: boolean
}

interface UseTimerOptions {
  prefix: string
  totalMs?: number // default: 25 min (padrão Pomodoro)
  onComplete?: () => void
}

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10) // "YYYY-MM-DD"
}

function loadTimer(prefix: string): TimerState & { startedAt?: number } {
  const key = `${prefix}:timer:${getTodayKey()}`
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return { elapsed: 0, remaining: 0, running: false }
    const parsed = JSON.parse(raw) as { elapsed: number; startedAt?: number; running?: boolean }
    const now = Date.now()
    if (parsed.startedAt && parsed.running) {
      return {
        elapsed: parsed.elapsed + (now - parsed.startedAt),
        remaining: 0,
        running: true,
        startedAt: parsed.startedAt,
      }
    }
    return {
      elapsed: parsed.elapsed,
      remaining: 0,
      running: false,
    }
  } catch {
    return { elapsed: 0, remaining: 0, running: false }
  }
}

function saveTimer(prefix: string, state: { elapsed: number; startedAt?: number; running: boolean }): void {
  const key = `${prefix}:timer:${getTodayKey()}`
  try {
    localStorage.setItem(key, JSON.stringify(state))
  } catch {
    // quota excedida — ignorar (não-crítico)
  }
}

export function useTimer({ prefix, totalMs = 25 * 60 * 1000, onComplete }: UseTimerOptions) {
  const [state, setState] = useState<TimerState>(() => loadTimer(prefix))
  const total = totalMs
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number>(0)

  /** Loop de animação (requestAnimationFrame) para atualizar o relógio sem setInterval.
   *  requestAnimationFrame = método do navegador que pede para executar uma função
   *  antes do próximo repaint (render), ideal para animações suaves. */
  const tick = useCallback(() => {
    if (!state.running) return
    const elapsed = state.elapsed + (Date.now() - startRef.current)
    const remaining = Math.max(0, total - elapsed)
    setState({ elapsed, remaining, running: true })
    if (remaining === 0 && onComplete) {
      onComplete()
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [state.running, state.elapsed, total, onComplete])

  const start = useCallback(() => {
    const now = Date.now()
    startRef.current = now
    const saved = loadTimer(prefix)
    const initialState = saved.startedAt ? saved.elapsed : saved.elapsed
    setState({ elapsed: initialState, remaining: Math.max(0, total - initialState), running: true })
    saveTimer(prefix, { elapsed: initialState, startedAt: now, running: true })
    rafRef.current = requestAnimationFrame(tick)
  }, [prefix, total, tick])

  const pause = useCallback(() => {
    if (!state.running) return
    const now = Date.now()
    const finalElapsed = state.elapsed + (now - startRef.current)
    setState({ elapsed: finalElapsed, remaining: Math.max(0, total - finalElapsed), running: false })
    saveTimer(prefix, { elapsed: finalElapsed, running: false })
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [state, total, prefix])

  const reset = useCallback(() => {
    const key = `${prefix}:timer:${getTodayKey()}`
    try {
      localStorage.removeItem(key)
    } catch {}
    setState({ elapsed: 0, remaining: total, running: false })
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    if (onComplete) onComplete()
  }, [prefix, total, onComplete])

  useEffect(() => {
    const saved = loadTimer(prefix)
    if (saved.running && saved.startedAt) {
      startRef.current = saved.startedAt
      setState({
        elapsed: saved.elapsed,
        remaining: Math.max(0, total - saved.elapsed),
        running: true,
      })
      rafRef.current = requestAnimationFrame(tick)
    }
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefix])

  return { ...state, start, pause, reset }
}

/**
 * Formata milissegundos em "HH:MM:SS"
 */
export function formatMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000)
  const h = Math.floor(totalSec / 3600)
  const m = Math.floor((totalSec % 3600) / 60)
  const s = totalSec % 60
  return [h, m, s].map(v => String(v).padStart(2, '0')).join(':')
}
