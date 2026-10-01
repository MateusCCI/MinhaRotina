import * as Notifications from 'expo-notifications';
import { prepararNotificacoes, semNotificacaoDeSistema } from './notificacoes';

export const ALARME_MINUTOS = 15;
const CHANNEL_ID = 'minha-rotina-saida';
const IDENTIFICADOR = 'alarme-saida';

export interface AlarmeSaida {
  /** Horário de saída em "HH:MM". */
  hora: string;
  /** Momento em que a notificação dispara (15 min antes). */
  em: Date;
}

/** Monta o instante do alarme a partir de "HH:MM" de hoje (ou de amanhã). */
export function alarmeDateFor(hora: string, minutosAntes = ALARME_MINUTOS): Date {
  const [h, m] = hora.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  d.setMinutes(d.getMinutes() - minutosAntes);
  if (d.getTime() <= Date.now()) {
    // Horário de hoje já passou: agenda para amanhã.
    d.setDate(d.getDate() + 1);
  }
  return d;
}

/** "07:40" → "07:25". */
export function horarioAlarme(hora: string, minutosAntes = ALARME_MINUTOS): string {
  const [h, m] = hora.split(':').map(Number);
  const total = h * 60 + m - minutosAntes;
  const hh = Math.floor(((total % 1440) + 1440) % 1440 / 60);
  const mm = ((total % 60) + 60) % 60;
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

export function unsupportedPlatform(): boolean {
  // Não há alarme de sistema no navegador; a UI da Saída avisa isso.
  return semNotificacaoDeSistema();
}

/**
 * Agenda o lembrete de saída.
 *
 * **Limite honesto:** o texto original do projeto dizia que o alarme "só toca
 * se ainda tem pendência". Uma notificação local agendada **não consegue**
 * ler o banco no instante em que dispara — o app pode estar fechado. Então
 * o que foi entregue é o lembrete com o horário e a contagem de pendências
 * **congeladas no momento do agendamento**, e o app reavalia quando abre.
 * Prometer a condição real exigiria tarefa de background, fora do escopo.
 */
export async function agendarAlarme(
  hora: string,
  pendencias: number,
): Promise<AlarmeSaida | null> {
  if (unsupportedPlatform()) return null;

  const em = alarmeDateFor(hora);
  const titulo = pendencias > 0 ? `Faltam ${pendencias} para sair` : 'Hora de ir embora';
  const corpo =
    pendencias > 0
      ? `Sua saída é às ${hora}. Ainda tem ${pendencias} ${pendencias === 1 ? 'item' : 'itens'} para conferir.`
      : `Checklist conferido. Saída às ${hora} — pode ir tranquilo.`;

  const notif = await notifications();
  await notif.cancelScheduledNotificationAsync(IDENTIFICADOR).catch(() => undefined);
  await notif.scheduleNotificationAsync({
    // O `identifier` precisa ser explícito: sem ele a biblioteca sorteia um
    // UUID, e o cancelamento logo acima (por IDENTIFICADOR) vira no-op —
    // cada reagendamento empilhava mais um alarme.
    identifier: IDENTIFICADOR,
    content: { title: titulo, body: corpo },
    trigger: { type: notif.SchedulableTriggerInputTypes.DATE, date: em },
  });

  return { hora, em };
}

export async function cancelarAlarme(): Promise<void> {
  if (unsupportedPlatform()) return;
  const notif = await notifications();
  await notif.cancelScheduledNotificationAsync(IDENTIFICADOR).catch(() => undefined);
}

/**
 * No Android é preciso declarar o canal antes de agendar, senão a
 * notificação é silenciada pelo sistema. No iOS a permissão é pedida na hora.
 */
async function notifications(): Promise<typeof Notifications> {
  const notif = await prepararNotificacoes({ id: CHANNEL_ID, nome: 'Lembrete de saída' });
  if (!notif) throw new Error('Notificações indisponíveis');
  return notif;
}
