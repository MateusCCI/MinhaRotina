import { Platform } from 'react-native';
// Só o TIPO vem deste import: `import type` desaparece na compilação e não
// puxa o módulo nativo em tempo de execução.
import type * as ExpoNotifications from 'expo-notifications';

/**
 * Infraestrutura de notificações compartilhada.
 *
 * Existe como módulo separado porque dois avisos diferentes dependem dela:
 * o lembrete de saída (`alarme.ts`) e o aviso de fim de bloco do Pomodoro
 * (`avisoBloco.ts`). Antes cada um repetia a mesma sequência de canal e
 * permissão.
 */

/** Não há notificação de sistema no navegador; quem agenda diz isso na UI. */
export function semNotificacaoDeSistema(): boolean {
  return Platform.OS === 'web';
}

/**
 * Carrega o módulo de notificações sob demanda, devolvendo `null` se ele não
 * existir no build.
 *
 * Isto não é defensiva paranoia: o `expo-notifications` é um módulo **nativo**,
 * e ele não está em todo lugar. Um import no topo do arquivo resolve o módulo
 * na hora em que o arquivo é importado — então, se o módulo faltar, o erro
 * acontece **antes** de qualquer tela renderizar, e o app inteiro morre com
 * uma tela branca em vez de rodar sem notificação.
 *
 * Foi exatamente o que aconteceu no aparelho: `require('expo-notifications')`
 * no topo de `App.tsx` derrubou a aplicação na abertura. A pergunta certa não é
 * "o módulo existe?" e sim "o que o app faz quando não existe?" — e a resposta
 * é: ele abre, e apenas o aviso fica indisponível.
 */
export function moduloNotificacoes(): typeof ExpoNotifications | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('expo-notifications') as typeof ExpoNotifications;
  } catch (error) {
    console.warn('[notificacoes] módulo nativo indisponível neste build:', error);
    return null;
  }
}

/**
 * Garante canal (Android) e permissão (iOS/Android) e devolve o módulo das
 * notificações.
 *
 * O canal precisa existir **antes** de agendar: no Android, agendar para um
 * canal inexistente entrega a notificação silenciada pelo sistema — parece
 * que o app não avisou, quando na verdade avisou sem som.
 *
 * Devolve `null` quando a permissão foi negada **ou o módulo não existe**,
 * para o chamador não tratar como sucesso algo que o sistema não vai exibir.
 */
export async function prepararNotificacoes(
  canal?: { id: string; nome: string }
): Promise<typeof ExpoNotifications | null> {
  if (semNotificacaoDeSistema()) return null;

  const Notifications = moduloNotificacoes();
  if (!Notifications) return null;

  if (Platform.OS === 'android' && canal) {
    await Notifications.setNotificationChannelAsync(canal.id, {
      name: canal.nome,
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const pedido = await Notifications.requestPermissionsAsync();
    if (pedido.status !== 'granted') return null;
  }
  return Notifications;
}
