import { useState, useEffect, useCallback } from 'react';
import DatabaseSingleton from '../src/lib/database';
import { InboxItem } from '../src/lib/types';

export function useInbox() {
  const [items, setItems] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEmpty, setIsEmpty] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      const db = await DatabaseSingleton.getInstance();
      const data = await db.getInboxItems();
      setItems(data);
      const empty = await db.isinboxEmpty();
      setIsEmpty(empty);
    } catch (error) {
      console.error('Erro ao buscar inbox:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const addItem = async (content: string): Promise<void> => {
    try {
      const db = await DatabaseSingleton.getInstance();
      const id = await db.insertInboxItem(content);
      const newItem: InboxItem = {
        id,
        content,
        created_at: new Date().toISOString(),
      };
      setItems(prev => [newItem, ...prev]);
      setIsEmpty(false);
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      throw error;
    }
  };

  const deleteItem = async (id: number): Promise<void> => {
    try {
      const db = await DatabaseSingleton.getInstance();
      await db.deleteInboxItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
      const empty = await db.isinboxEmpty();
      setIsEmpty(empty);
      if (empty) {
        await db.registerEvent('inbox_zerado');
      }
    } catch (error) {
      console.error('Erro ao deletar item:', error);
      throw error;
    }
  };

  const promoteToHoje = async (id: number): Promise<boolean> => {
    try {
      const db = await DatabaseSingleton.getInstance();
      await db.insertHojeItem(id);
      await db.deleteInboxItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
      const empty = await db.isinboxEmpty();
      setIsEmpty(empty);
      if (empty) {
        await db.registerEvent('inbox_zerado');
      }
      return true;
    } catch (error) {
      if (error instanceof Error && error.message === 'MAX_ITEMS') {
        return false;
      }
      console.error('Erro ao promover item:', error);
      throw error;
    }
  };

  return { items, loading, isEmpty, addItem, deleteItem, promoteToHoje, fetchItems };
}
