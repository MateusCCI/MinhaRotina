import * as SQLite from 'expo-sqlite';
import { InboxItem, HojeItem, SaidaItem } from './types';

class DatabaseSingleton {
  private static instance: DatabaseSingleton | null = null;
  private db: SQLite.SQLiteDatabase | null = null;
  private initialized: boolean = false;

  private constructor() {}

  static async getInstance(): Promise<DatabaseSingleton> {
    if (!DatabaseSingleton.instance) {
      DatabaseSingleton.instance = new DatabaseSingleton();
    }
    return DatabaseSingleton.instance;
  }

  async init(): Promise<void> {
    if (this.initialized) return;
    if (!this.db) {
      this.db = await SQLite.openDatabaseAsync('minha_rotina.db');
      await this.createTables();
      await this.resetHojeForNewDay();
    }
    this.initialized = true;
  }

  private async createTables(): Promise<void> {
    const traceId = this.generateTraceId();
    try {
      await this.db!.execAsync(`
        CREATE TABLE IF NOT EXISTS inbox_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          content TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await this.db!.execAsync(`
        CREATE TABLE IF NOT EXISTS hoje_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          inbox_id INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          checked INTEGER DEFAULT 0,
          FOREIGN KEY (inbox_id) REFERENCES inbox_items(id)
        );
      `);
      await this.db!.execAsync(`
        CREATE TABLE IF NOT EXISTS saida_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          content TEXT NOT NULL,
          position INTEGER NOT NULL DEFAULT 0,
          checked INTEGER DEFAULT 0,
          checked_at DATETIME
        );
      `);
      await this.db!.execAsync(`
        CREATE TABLE IF NOT EXISTS saida_log (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          saiu_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await this.seedSaidaItems();
      console.log(`[S1][TRACE:${traceId}] Tabelas criadas com sucesso`);
    } catch (error) {
      console.error(`[S1][TRACE:${traceId}] Erro ao criar tabelas:`, error);
      throw error;
    }
  }

  private generateTraceId(): string {
    return `s1-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private async seedSaidaItems(): Promise<void> {
    const row = await this.db!.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM saida_items'
    );
    if ((row?.count ?? 0) > 0) return;
    const defaults = ['chave', 'ponto', 'marmita', 'fone', 'portão'];
    for (let i = 0; i < defaults.length; i++) {
      await this.db!.runAsync(
        'INSERT INTO saida_items (content, position) VALUES (?, ?)',
        [defaults[i], i]
      );
    }
  }

  private async resetHojeForNewDay(): Promise<void> {
    const traceId = this.generateTraceId();
    try {
      await this.db!.withTransactionAsync(async () => {
        await this.db!.runAsync(
          `INSERT INTO inbox_items (content)
           SELECT i.content
           FROM hoje_items h
           JOIN inbox_items i ON h.inbox_id = i.id
           WHERE date(h.created_at) < date('now') AND h.checked = 0`
        );
        await this.db!.runAsync(
          `DELETE FROM hoje_items WHERE date(created_at) < date('now')`
        );
        await this.db!.runAsync(
          `UPDATE saida_items SET checked = 0, checked_at = NULL
           WHERE checked = 1 AND date(checked_at) < date('now')`
        );
      });
      console.log(`[S1][TRACE:${traceId}] Reset diário do Hoje concluído`);
    } catch (error) {
      console.error(`[S1][TRACE:${traceId}] Erro no reset diário:`, error);
      throw error;
    }
  }

  // Saida queries
  async getSaidaItems(): Promise<SaidaItem[]> {
    const traceId = this.generateTraceId();
    try {
      const result = await this.db!.getAllAsync<any>(
        'SELECT * FROM saida_items ORDER BY position ASC'
      );
      const normalized = result.map(row => ({
        ...row,
        checked: row.checked === 1 || row.checked === true,
      }));
      console.log(`[S1][TRACE:${traceId}] Saída: ${normalized.length} itens`);
      return normalized;
    } catch (error) {
      console.error(`[S1][TRACE:${traceId}] Erro ao buscar itens de saída:`, error);
      throw error;
    }
  }

  async toggleSaidaItem(id: number): Promise<void> {
    const traceId = this.generateTraceId();
    try {
      const item = await this.db!.getFirstAsync<any>(
        'SELECT * FROM saida_items WHERE id = ?',
        [id]
      );
      const newChecked = item ? (item.checked ? 0 : 1) : 0;
      await this.db!.runAsync(
        `UPDATE saida_items
         SET checked = ?, checked_at = CASE WHEN ? = 1 THEN CURRENT_TIMESTAMP ELSE NULL END
         WHERE id = ?`,
        [newChecked, newChecked, id]
      );
      console.log(`[S1][TRACE:${traceId}] Saída toggled: id=${id}, checked=${newChecked === 1}`);
    } catch (error) {
      console.error(`[S1][TRACE:${traceId}] Erro ao toggle item de saída:`, error);
      throw error;
    }
  }

  async registerSaida(): Promise<void> {
    const traceId = this.generateTraceId();
    try {
      await this.db!.runAsync('INSERT INTO saida_log DEFAULT VALUES');
      console.log(`[S1][TRACE:${traceId}] Saída registrada`);
    } catch (error) {
      console.error(`[S1][TRACE:${traceId}] Erro ao registrar saída:`, error);
      throw error;
    }
  }

  async getSaidaLogsToday(): Promise<string[]> {
    const traceId = this.generateTraceId();
    try {
      const result = await this.db!.getAllAsync<{ saiu_at: string }>(
        `SELECT saiu_at FROM saida_log WHERE date(saiu_at) = date('now') ORDER BY saiu_at DESC`
      );
      console.log(`[S1][TRACE:${traceId}] Saídas hoje: ${result.length}`);
      return result.map(r => r.saiu_at);
    } catch (error) {
      console.error(`[S1][TRACE:${traceId}] Erro ao buscar saídas de hoje:`, error);
      throw error;
    }
  }

  // Inbox queries
  async getInboxItems(): Promise<InboxItem[]> {
    const traceId = this.generateTraceId();
    try {
      const result = await this.db!.getAllAsync<InboxItem>(
        'SELECT * FROM inbox_items ORDER BY created_at DESC'
      );
      console.log(`[S1][TRACE:${traceId}] Inbox: ${result.length} itens`);
      return result;
    } catch (error) {
      console.error(`[S1][TRACE:${traceId}] Erro ao buscar inbox:`, error);
      throw error;
    }
  }

  async insertInboxItem(content: string): Promise<number> {
    const traceId = this.generateTraceId();
    try {
      const result = await this.db!.runAsync(
        'INSERT INTO inbox_items (content) VALUES (?)',
        [content]
      );
      console.log(`[S1][TRACE:${traceId}] Item inserido: id=${result.lastInsertRowId}`);
      return result.lastInsertRowId as number;
    } catch (error) {
      console.error(`[S1][TRACE:${traceId}] Erro ao inserir item:`, error);
      throw error;
    }
  }

  async deleteInboxItem(id: number): Promise<void> {
    const traceId = this.generateTraceId();
    try {
      await this.db!.runAsync('DELETE FROM inbox_items WHERE id = ?', [id]);
      console.log(`[S1][TRACE:${traceId}] Item deletado: id=${id}`);
    } catch (error) {
      console.error(`[S1][TRACE:${traceId}] Erro ao deletar item:`, error);
      throw error;
    }
  }

  // Hoje queries
  async getHojeItems(): Promise<HojeItem[]> {
    const traceId = this.generateTraceId();
    try {
      const result = await this.db!.getAllAsync<HojeItem>(
        `SELECT h.*, i.content
         FROM hoje_items h
         JOIN inbox_items i ON h.inbox_id = i.id
         WHERE date(h.created_at) = date('now')
         ORDER BY h.created_at ASC`
      );
      const normalized = result.map(row => ({
        ...row,
        checked: row.checked === 1 || row.checked === true,
      }));
      console.log(`[S1][TRACE:${traceId}] Hoje: ${normalized.length} itens`);
      return normalized;
    } catch (error) {
      console.error(`[S1][TRACE:${traceId}] Erro ao buscar hoje:`, error);
      throw error;
    }
  }

  async insertHojeItem(inboxId: number): Promise<number> {
    const traceId = this.generateTraceId();
    try {
      const current = await this.getHojeItems();
      if (current.length >= 3) {
        throw new Error('MAX_ITEMS');
      }
      const result = await this.db!.runAsync(
        'INSERT INTO hoje_items (inbox_id) VALUES (?)',
        [inboxId]
      );
      console.log(`[S1][TRACE:${traceId}] Item promovido: id=${result.lastInsertRowId}`);
      return result.lastInsertRowId as number;
    } catch (error) {
      console.error(`[S1][TRACE:${traceId}] Erro ao promover item:`, error);
      throw error;
    }
  }

  async deleteHojeItem(id: number): Promise<void> {
    const traceId = this.generateTraceId();
    try {
      await this.db!.runAsync('DELETE FROM hoje_items WHERE id = ?', [id]);
      console.log(`[S1][TRACE:${traceId}] Item removido do hoje: id=${id}`);
    } catch (error) {
      console.error(`[S1][TRACE:${traceId}] Erro ao remover do hoje:`, error);
      throw error;
    }
  }

  async toggleHojeItem(id: number): Promise<void> {
    const traceId = this.generateTraceId();
    try {
      const item = await this.db!.getFirstAsync<HojeItem>(
        'SELECT * FROM hoje_items WHERE id = ?',
        [id]
      );
      const newChecked = item ? (item.checked ? 0 : 1) : 0;
      await this.db!.runAsync(
        'UPDATE hoje_items SET checked = ? WHERE id = ?',
        [newChecked, id]
      );
      console.log(`[S1][TRACE:${traceId}] Checkbox toggled: id=${id}, checked=${newChecked === 1}`);
    } catch (error) {
      console.error(`[S1][TRACE:${traceId}] Erro ao toggle checkbox:`, error);
      throw error;
    }
  }

  async isinboxEmpty(): Promise<boolean> {
    const traceId = this.generateTraceId();
    try {
      const result = await this.db!.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM inbox_items'
      );
      return (result?.count ?? 0) === 0;
    } catch (error) {
      console.error(`[S1][TRACE:${traceId}] Erro ao verificar inbox vazio:`, error);
      throw error;
    }
  }
}

export default DatabaseSingleton;
