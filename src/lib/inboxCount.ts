type Listener = (count: number) => void;

let count = 0;
const listeners = new Set<Listener>();

export function setInboxCount(n: number): void {
  count = n;
  listeners.forEach(listener => listener(count));
}

export function subscribeInboxCount(listener: Listener): () => void {
  listeners.add(listener);
  listener(count);
  return () => {
    listeners.delete(listener);
  };
}