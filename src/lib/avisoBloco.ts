import { prepararNotificacoes, semNotificacaoDeSistema, moduloNotificacoes } from './notificacoes';

const CHANNEL_ID = 'minha-rotina-bloco';

/**
 * Identificador estável por prefixo. É o que permite reagendar: sem ele a
 * biblioteca sorteia um UUID e cada reagendamento empilha uma notificação —
 * exatamente o defeito que o alarme de saída tinha.
 */
function identificador(prefix: string): string {
  return `bloco-${prefix}`;
}

/**
 * Agenda o aviso de fim do bloco no **sistema operacional**.
 *
 * Por que isso é necessário: o cronômetro da tela roda em
 * `requestAnimationFrame`, que o sistema congela assim que o app vai para
 * segundo plano. Sem um aviso agendado, fechar o app no meio de um bloco
 * significa não saber que o bloco acabou.
 *
 * O tempo informado é o que **falta**, não a duração total: quem retoma um
 * bloco pausado aos 8 minutos de 25 precisa do aviso aos 17, não aos 25.
 */
export async function agendarAvisoFimBloco(
  prefix: string,
  restanteMs: number,
  duracaoMin: number
): Promise<boolean> {
  if (semNotificacaoDeSistema() || restanteMs <= 0) return false;

  try {
    const notif = await prepararNotificacoes({ id: CHANNEL_ID, nome: 'Fim de bloco' });
    if (!notif) return false;

    await notif.cancelScheduledNotificationAsync(identificador(prefix)).catch(() => undefined);
    await notif.scheduleNotificationAsync({
      identifier: identificador(prefix),
      content: {
        title: `Bloco de ${duracaoMin} min concluído`,
        body: 'O foco terminou. Respire antes de escolher o próximo passo.',
        // Sem som customizado: o importante é chegar mesmo com o app fechado.
        sound: true,
      },
      trigger: {
        type: notif.SchedulableTriggerInputTypes.DATE,
        date: new Date(Date.now() + restanteMs),
      },
    });
    return true;
  } catch (error) {
    // Falhar em agendar não pode derrubar o cronômetro: a folha de fim de
    // bloco dentro do app continua funcionando.
    console.error('Erro ao agendar aviso de fim de bloco:', error);
    return false;
  }
}

/** Cancela o aviso pendente. Idempotente: nada agendado não é erro. */
export async function cancelarAvisoFimBloco(prefix: string): Promise<void> {
  if (semNotificacaoDeSistema()) return;
  const Notifications = moduloNotificacoes();
  if (!Notifications) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(identificador(prefix)).catch(() => undefined);
  } catch (error) {
    console.error('Erro ao cancelar aviso de fim de bloco:', error);
  }
}