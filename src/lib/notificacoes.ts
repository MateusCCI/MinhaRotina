import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

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
 * Garante canal (Android) e permissão (iOS/Android) e devolve o módulo das
 * notificações.
 *
 * O canal precisa existir **antes** de agendar: no Android, agendar para um
 * canal inexistente entrega a notificação silenciada pelo sistema — parece
 * que o app não avisou, quando na verdade avisou sem som.
 *
 * Devolve `null` quando a permissão foi negada, para o chamador não tratar
 * como sucesso algo que o sistema não vai exibir.
 */
export async function prepararNotificacoes(
  canal?: { id: string; nome: string }
): Promise<typeof Notifications | null> {
  if (semNotificacaoDeSistema()) return null;

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