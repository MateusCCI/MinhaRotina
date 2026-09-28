/** Sessão local: quem está usando o app agora. Mesmo padrão pub/sub do inboxCount. */
type SessionListener = (userId: number | null) => void;

let current: number | null = null;
const listeners = new Set<SessionListener>();

export function getSessionUser(): number | null {
  return current;
}

export function setSessionUser(userId: number | null): void {
  current = userId;
  listeners.forEach(l => l(userId));
}

export function subscribeSession(listener: SessionListener): () => void {
  listeners.add(listener);
  listener(current);
  return () => {
    listeners.delete(listener);
  };
}
