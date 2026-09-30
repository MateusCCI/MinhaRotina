import { Alert, Platform } from 'react-native';

/**
 * Aviso que funciona nas três plataformas.
 *
 * O `Alert` do react-native-web é **no-op silencioso**: nada aparece na
 * tela e nada vai para o console. Como o navegador é o ambiente onde o
 * app é testado, todo aviso sumia — limite de foco, falha de banco,
 * confirmação de exclusão. O app parecia funcionar enquanto escondia
 * erro, que é o pior tipo de falha: silenciosa.
 *
 * No Android/iOS continua o diálogo nativo. No web cai no diálogo do
 * navegador, que é feio mas **visível** — visibilidade vale mais que
 * estética num aviso de erro. A evolução natural é um toast no app
 * (mesmo padrão pub/sub de `inboxCount.ts`).
 */
export function notify(title: string, message?: string): void {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.alert(message ? `${title}\n\n${message}` : title);
    }
    return;
  }
  Alert.alert(title, message);
}

/** Confirmação destrutiva: no web depende do `window.confirm`. */
export function confirmDestructive(
  title: string,
  message: string,
  confirmLabel: string,
  onConfirm: () => void,
): void {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.confirm(`${title}\n\n${message}`)) {
      onConfirm();
    }
    return;
  }
  Alert.alert(title, message, [
    { text: 'Cancelar', style: 'cancel' },
    { text: confirmLabel, style: 'destructive', onPress: onConfirm },
  ]);
}
