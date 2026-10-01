import { useState, useEffect, useCallback, useRef } from 'react';
import DatabaseSingleton from '../src/lib/database';
import { HojeItem } from '../src/lib/types';
import { statusColor, theme } from '../src/lib/theme';

export function useHoje() {
  const [items, setItems] = useState<HojeItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    try {
      const db = await DatabaseSingleton.getInstance();
      const data = await db.getHojeItems();
      setItems(data);
    } catch (error) {
      console.error('Erro ao buscar hoje:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  /**
   * Ids com escrita em andamento. Dois toques no mesmo item enfileiravam dois
   * toggles, que se cancelavam por inteiro — para o usuário, o toque sumia.
   */
  const emVoo = useRef(new Set<number>());

  const toggleItem = async (id: number): Promise<void> => {
    if (emVoo.current.has(id)) return;
    emVoo.current.add(id);
    try {
      const db = await DatabaseSingleton.getInstance();
      await db.toggleHojeItem(id);
      // Refaz a leitura em vez de inverter o estado local: manter banco e
      // React em paralelo é o que fazia a lista divergir do que foi salvo.
      await fetchItems();
    } catch (error) {
      console.error('Erro ao toggle item:', error);
      throw error;
    } finally {
      emVoo.current.delete(id);
    }
  };

  const deleteItem = async (id: number): Promise<void> => {
    try {
      const db = await DatabaseSingleton.getInstance();
      await db.deleteHojeItem(id);
      await fetchItems();
    } catch (error) {
      console.error('Erro ao deletar item do hoje:', error);
      throw error;
    }
  };

  const getProgress = useCallback((): { percentage: number; color: string } => {
    if (items.length === 0) return { percentage: 0, color: theme.colors.textMuted };
    const checked = items.filter(item => item.checked).length;
    return {
      percentage: Math.round((checked / items.length) * 100),
      color: statusColor(Math.round((checked / items.length) * 100)),
    };
  }, [items]);

  return { items, loading, toggleItem, deleteItem, getProgress, fetchItems };
}
