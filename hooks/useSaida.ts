import { useState, useEffect, useCallback } from 'react';
import DatabaseSingleton from '../src/lib/database';
import { SaidaItem } from '../src/lib/types';

export function useSaida() {
  const [items, setItems] = useState<SaidaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saidasHoje, setSaidasHoje] = useState<string[]>([]);

  const fetchItems = useCallback(async () => {
    try {
      const db = await DatabaseSingleton.getInstance();
      const data = await db.getSaidaItems();
      setItems(data);
      const logs = await db.getSaidaLogsToday();
      setSaidasHoje(logs);
    } catch (error) {
      console.error('Erro ao buscar itens de saída:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const toggleItem = useCallback(async (id: number): Promise<void> => {
    try {
      const db = await DatabaseSingleton.getInstance();
      await db.toggleSaidaItem(id);
      setItems(prev =>
        prev.map(item => (item.id === id ? { ...item, checked: !item.checked } : item))
      );
    } catch (error) {
      console.error('Erro ao toggle item de saída:', error);
      throw error;
    }
  }, []);

  const registerSaida = useCallback(async (): Promise<string> => {
    try {
      const db = await DatabaseSingleton.getInstance();
      await db.registerSaida();
      const logs = await db.getSaidaLogsToday();
      setSaidasHoje(logs);
      return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Erro ao registrar saída:', error);
      throw error;
    }
  }, []);

  const allChecked = items.length > 0 && items.every(i => i.checked);

  return { items, loading, allChecked, saidasHoje, toggleItem, registerSaida, fetchItems };
}