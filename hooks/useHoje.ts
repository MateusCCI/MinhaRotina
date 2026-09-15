import { useState, useEffect, useCallback } from 'react';
import DatabaseSingleton from '../src/lib/database';
import { HojeItem } from '../src/lib/types';

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

  const toggleItem = async (id: number): Promise<void> => {
    try {
      const db = await DatabaseSingleton.getInstance();
      await db.toggleHojeItem(id);
      setItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, checked: !item.checked } : item
        )
      );
    } catch (error) {
      console.error('Erro ao toggle item:', error);
      throw error;
    }
  };

  const deleteItem = async (id: number): Promise<void> => {
    try {
      const db = await DatabaseSingleton.getInstance();
      await db.deleteHojeItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Erro ao deletar item do hoje:', error);
      throw error;
    }
  };

  const addItemFromInbox = async (inboxId: number): Promise<{ success: boolean; message?: string }> => {
    try {
      const db = await DatabaseSingleton.getInstance();
      await db.insertHojeItem(inboxId);
      await fetchItems();
      return { success: true };
    } catch (error) {
      if (error instanceof Error && error.message === 'MAX_ITEMS') {
        return { success: false, message: 'Máximo 3 prioridades. Complete itens antes de adicionar.' };
      }
      console.error('Erro ao adicionar item:', error);
      return { success: false, message: 'Erro ao adicionar item.' };
    }
  };

  const getProgress = useCallback((): { percentage: number; color: string } => {
    if (items.length === 0) return { percentage: 0, color: '#EF4444' };
    const checked = items.filter(item => item.checked).length;
    const percentage = Math.round((checked / items.length) * 100);
    if (percentage < 34) return { percentage, color: '#EF4444' };
    if (percentage < 67) return { percentage, color: '#EAB308' };
    return { percentage, color: '#22C55E' };
  }, [items]);

  return { items, loading, toggleItem, deleteItem, addItemFromInbox, getProgress, fetchItems };
}
