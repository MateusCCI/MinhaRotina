import * as SQLite from 'expo-sqlite';
import { InboxItem, HojeItem, SaidaItem } from './types';
import { toLocalDateString, utcDayStart } from './date';

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
          due_date TEXT,
          category TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await this.db!.execAsync(`
        CREATE TABLE IF NOT EXISTS hoje_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          inbox_id INTEGER NOT NULL,
          content TEXT NOT NULL DEFAULT '',
          due_date TEXT,
          category TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          checked INTEGER DEFAULT 0
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
      await this.db!.execAsync(`
        CREATE TABLE IF NOT EXISTS events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          type TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await this.db!.execAsync(`
        CREATE TABLE IF NOT EXISTS ajustes_semanais (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          texto TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await this.db!.execAsync(`
        CREATE TABLE IF NOT EXISTS timer_state (
          prefix TEXT PRIMARY KEY,
          day TEXT NOT NULL,
          elapsed_ms INTEGER NOT NULL DEFAULT 0,
          running INTEGER NOT NULL DEFAULT 0,
          started_at INTEGER
        );
      `);
      await this.db!.execAsync(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT,
          salt TEXT,
          password_hash TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
      await this.db!.execAsync(`
        CREATE TABLE IF NOT EXISTS meta (
          key TEXT PRIMARY KEY,
          value TEXT
        );
      `);
      await this.ensureColumn('inbox_items', 'due_date', 'TEXT');
      await this.ensureColumn('inbox_items', 'category', 'TEXT');
      // Correção de 28/09 (bug do promote): hoje_items passou a carregar o
      // próprio conteúdo em vez de depender do JOIN com inbox_items.
      await this.ensureColumn('hoje_items', 'content', "TEXT NOT NULL DEFAULT ''");
      await this.ensureColumn('hoje_items', 'due_date', 'TEXT');
      await this.ensureColumn('hoje_items', 'category', 'TEXT');
      // Correção de 28/09 (login com e-mail e senha): credenciais no perfil.
      await this.ensureColumn('users', 'email', 'TEXT');
      await this.ensureColumn('users', 'salt', 'TEXT');
      await this.ensureColumn('users', 'password_hash', 'TEXT');
      // Remove órfãos do bug antigo (promovidos cuja linha do inbox foi deletada).
      await this.db!.runAsync(
        `DELETE FROM hoje_items
         WHERE (content IS NULL OR content = '')
           AND inbox_id NOT IN (SELECT id FROM inbox_items)`
      );
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

  private async ensureColumn(table: string, column: string, definition: string): Promise<void> {
    try {
      await this.db!.runAsync(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
      console.log(`Coluna adicionada: ${table}.${column}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('duplicate column')) {
        return;
      }
      throw error;
    }
  }

  private async resetHojeForNewDay(): Promise<void> {
    const traceId = this.generateTraceId();
    try {
      // Limite calculado em JS: "ontem" é o dia local da pessoa, não o dia
      // UTC. Entre 21h e meia-noite o dia UTC já é o de amanhã, e o reset
      // apagava a lista na hora errada.
      const inicioHoje = utcDayStart();
      await this.db!.withTransactionAsync(async () => {
        await this.db!.runAsync(
          `INSERT INTO inbox_items (content, due_date, category)
           SELECT h.content, h.due_date, h.category
           FROM hoje_items h
           WHERE h.created_at < ? AND h.checked = 0`,
          [inicioHoje]
        );
        await this.db!.runAsync('DELETE FROM hoje_items WHERE created_at < ?', [inicioHoje]);
        await this.db!.runAsync(
          `UPDATE saida_items SET checked = 0, checked_at = NULL
           WHERE checked = 1 AND checked_at < ?`,
          [inicioHoje]
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

  async insertSaidaItem(content: string): Promise<number> {
    const traceId = this.generateTraceId();
    try {
      const row = await this.db!.getFirstAsync<{ m: number | null }>(
        'SELECT MAX(position) as m FROM saida_items'
      );
      const result = await this.db!.runAsync(
        'INSERT INTO saida_items (content, position) VALUES (?, ?)',
        [content.trim(), (row?.m ?? -1) + 1]
      );
      console.log(`[S1][TRACE:${traceId}] Item de saída criado: id=${result.lastInsertRowId}`);
      return result.lastInsertRowId as number;
    } catch (error) {
      console.error(`[S1][TRACE:${traceId}] Erro ao criar item de saída:`, error);
      throw error;
    }
  }

  async updateSaidaItem(id: number, content: string): Promise<void> {
    const traceId = this.generateTraceId();
    try {
      await this.db!.runAsync(
        'UPDATE saida_items SET content = ? WHERE id = ?',
        [content.trim(), id]
      );
      console.log(`[S1][TRACE:${traceId}] Item de saída editado: id=${id}`);
    } catch (error) {
      console.error(`[S1][TRACE:${traceId}] Erro ao editar item de saída:`, error);
      throw error;
    }
  }

  async deleteSaidaItem(id: number): Promise<void> {
    const traceId = this.generateTraceId();
    try {
      await this.db!.runAsync('DELETE FROM saida_items WHERE id = ?', [id]);
      console.log(`[S1][TRACE:${traceId}] Item de saída excluído: id=${id}`);
    } catch (error) {
      console.error(`[S1][TRACE:${traceId}] Erro ao excluir item de saída:`, error);
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
        `SELECT saiu_at FROM saida_log
         WHERE saiu_at >= ? AND saiu_at < ?
         ORDER BY saiu_at DESC`,
        [utcDayStart(), utcDayStart(1)]
      );
      console.log(`[S1][TRACE:${traceId}] Saídas hoje: ${result.length}`);
      return result.map(r => r.saiu_at);
    } catch (error) {
      console.error(`[S1][TRACE:${traceId}] Erro ao buscar saídas de hoje:`, error);
      throw error;
    }
  }

  // Events (audit log)
  async registerEvent(type: string): Promise<void> {
    const traceId = this.generateTraceId();
    try {
      await this.db!.runAsync('INSERT INTO events (type) VALUES (?)', [type]);
      console.log(`[S1][TRACE:${traceId}] Evento registrado: ${type}`);
    } catch (error) {
      console.error(`[S1][TRACE:${traceId}] Erro ao registrar evento:`, error);
      throw error;
    }
  }

  // Ajustes semanais
  async saveAjuste(texto: string): Promise<void> {
    const traceId = this.generateTraceId();
    try {
      await this.db!.runAsync('INSERT INTO ajustes_semanais (texto) VALUES (?)', [texto]);
      console.log(`[S1][TRACE:${traceId}] Ajuste semanal salvo`);
    } catch (error) {
      console.error(`[S1][TRACE:${traceId}] Erro ao salvar ajuste:`, error);
      throw error;
    }
  }

  async getRecentAjustes(): Promise<{ id: number; texto: string; created_at: string }[]> {
    const traceId = this.generateTraceId();
    try {
      const result = await this.db!.getAllAsync<{ id: number; texto: string; created_at: string }>(
        'SELECT * FROM ajustes_semanais ORDER BY created_at DESC LIMIT 3'
      );
      console.log(`[S1][TRACE:${traceId}] Ajustes recentes: ${result.length}`);
      return result;
    } catch (error) {
      console.error(`[S1][TRACE:${traceId}] Erro ao buscar ajustes:`, error);
      throw error;
    }
  }

  // Revisao (dados reais da semana)
  async getWeeklyStats(): Promise<{ inboxZerado: number; totalSaidas: number; mediaSaida: string }> {
    const traceId = this.generateTraceId();
    try {
      const zerado = await this.db!.getFirstAsync<{ n: number }>(
        `SELECT COUNT(DISTINCT date(created_at)) as n
         FROM events
         WHERE type = 'inbox_zerado' AND date(created_at) >= date('now', '-6 days')`
      );
      const saidas = await this.db!.getFirstAsync<{ n: number }>(
        `SELECT COUNT(*) as n FROM saida_log
         WHERE date(saiu_at) >= date('now', '-6 days')`
      );
      const logs = await this.db!.getAllAsync<{ saiu_at: string }>(
        `SELECT saiu_at FROM saida_log
         WHERE date(saiu_at) >= date('now', '-6 days') ORDER BY saiu_at ASC`
      );

      let mediaSaida = '--:--';
      if (logs.length > 0) {
        const totalMin = logs.reduce((acc, log) => {
          const [h, m] = log.saiu_at.slice(11, 16).split(':').map(Number);
          return acc + (h * 60 + m);
        }, 0);
        const mediaMin = Math.floor(totalMin / logs.length);
        const mm = String(mediaMin % 60).padStart(2, '0');
        const hh = String(Math.floor(mediaMin / 60)).padStart(2, '0');
        mediaSaida = `${hh}:${mm}`;
      }

      const stats = { inboxZerado: zerado?.n ?? 0, totalSaidas: saidas?.n ?? 0, mediaSaida };
      console.log(`[S1][TRACE:${traceId}] Estatísticas semanais:`, stats);
      return stats;
    } catch (error) {
      console.error(`[S1][TRACE:${traceId}] Erro ao calcular estatísticas:`, error);
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

  async insertInboxItem(content: string, dueDate?: string | null, category?: string | null): Promise<number> {
    const traceId = this.generateTraceId();
    try {
      const result = await this.db!.runAsync(
        'INSERT INTO inbox_items (content, due_date, category) VALUES (?, ?, ?)',
        [content, dueDate ?? null, category ?? null]
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

  async updateInboxItem(id: number, content: string, dueDate?: string | null, category?: string | null): Promise<void> {
    const traceId = this.generateTraceId();
    try {
      await this.db!.runAsync(
        'UPDATE inbox_items SET content = ?, due_date = ?, category = ? WHERE id = ?',
        [content, dueDate ?? null, category ?? null, id]
      );
      console.log(`[S1][TRACE:${traceId}] Item editado: id=${id}`);
    } catch (error) {
      console.error(`[S1][TRACE:${traceId}] Erro ao editar item:`, error);
      throw error;
    }
  }

  // Hoje queries
  async getHojeItems(): Promise<HojeItem[]> {
    const traceId = this.generateTraceId();
    try {
      const result = await this.db!.getAllAsync<HojeItem>(
        `SELECT id, inbox_id, content, due_date, category, created_at, checked
         FROM hoje_items
         WHERE created_at >= ? AND created_at < ?
         ORDER BY created_at ASC`,
        [utcDayStart(), utcDayStart(1)]
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
      // Sem teto de quantidade. A versão anterior recusava a partir da 4ª
      // prioridade com `throw new Error('MAX_ITEMS')`, o que transformava uma
      // sugestão da literatura em parede: quem tem um dia atípico — ou
      // simplesmente mais coisa para fazer — ficava travado justamente quando
      // a função executiva já estava sobrecarregada. O app aconselha e deixa
      // a decisão com quem usa.
      const source = await this.db!.getFirstAsync<InboxItem>(
        'SELECT * FROM inbox_items WHERE id = ?',
        [inboxId]
      );
      if (!source) {
        throw new Error('NOT_FOUND');
      }
      const result = await this.db!.runAsync(
        'INSERT INTO hoje_items (inbox_id, content, due_date, category) VALUES (?, ?, ?, ?)',
        [inboxId, source.content, source.due_date ?? null, source.category ?? null]
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
      // Ler e gravar dentro da mesma transação. Fora dela, dois toques
      // rápidos liam o mesmo `checked` e escreviam o mesmo valor novo: o
      // segundo toque era engolido e a tela acabava discordando do banco.
      await this.db!.withTransactionAsync(async () => {
        const item = await this.db!.getFirstAsync<{ checked: number }>(
          'SELECT checked FROM hoje_items WHERE id = ?',
          [id]
        );
        if (!item) return;
        await this.db!.runAsync('UPDATE hoje_items SET checked = ? WHERE id = ?', [
          item.checked ? 0 : 1,
          id,
        ]);
      });
      console.log(`[S1][TRACE:${traceId}] Checkbox toggled: id=${id}`);
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

  // Timer queries
  async getTimerState(prefix: string): Promise<{
    prefix: string;
    day: string;
    elapsedMs: number;
    running: boolean;
    startedAt?: number | null;
  } | null> {
    const traceId = this.generateTraceId();
    try {
      const row = await this.db!.getFirstAsync<{
        prefix: string;
        day: string;
        elapsed_ms: number;
        running: number;
        started_at: number | null;
      }>('SELECT * FROM timer_state WHERE prefix = ? AND day = ?', [
        prefix,
        toLocalDateString(new Date()),
      ]);
      if (!row) return null;
      return {
        prefix: row.prefix,
        day: row.day,
        elapsedMs: row.elapsed_ms,
        running: row.running === 1,
        startedAt: row.started_at,
      };
    } catch (error) {
      console.error(`[S1][TRACE:${traceId}] Erro ao buscar timer:`, error);
      throw error;
    }
  }

  async saveTimerState(
    prefix: string,
    elapsedMs: number,
    running: boolean,
    startedAt?: number | null
  ): Promise<void> {
    const traceId = this.generateTraceId();
    try {
      // Dia local, não UTC: o estado do timer vale para o dia da pessoa, e
      // entre 21h e meia-noite o dia UTC já é o de amanhã.
      const day = toLocalDateString(new Date());
      await this.db!.runAsync(
        `INSERT INTO timer_state (prefix, day, elapsed_ms, running, started_at)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(prefix) DO UPDATE SET
           day = excluded.day,
           elapsed_ms = excluded.elapsed_ms,
           running = excluded.running,
           started_at = excluded.started_at`,
        [prefix, day, Math.floor(elapsedMs), running ? 1 : 0, startedAt ?? null]
      );
      console.log(`[S1][TRACE:${traceId}] Timer salvo: ${prefix}`);
    } catch (error) {
      console.error(`[S1][TRACE:${traceId}] Erro ao salvar timer:`, error);
      throw error;
    }
  }

  async clearTimerState(prefix: string): Promise<void> {
    const traceId = this.generateTraceId();
    try {
      await this.db!.runAsync('DELETE FROM timer_state WHERE prefix = ?', [prefix]);
      console.log(`[S1][TRACE:${traceId}] Timer zerado: ${prefix}`);
    } catch (error) {
      console.error(`[S1][TRACE:${traceId}] Erro ao zerar timer:`, error);
      throw error;
    }
  }

  // Preferências (tabela key/value)
  async getMeta(key: string): Promise<string | null> {
    const traceId = this.generateTraceId();
    try {
      const row = await this.db!.getFirstAsync<{ value: string | null }>(
        'SELECT value FROM meta WHERE key = ?',
        [key]
      );
      return row?.value ?? null;
    } catch (error) {
      console.error(`[S1][TRACE:${traceId}] Erro ao ler preferência ${key}:`, error);
      throw error;
    }
  }

  async setMeta(key: string, value: string): Promise<void> {
    const traceId = this.generateTraceId();
    try {
      await this.db!.runAsync(
        `INSERT INTO meta (key, value) VALUES (?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
        [key, value]
      );
      console.log(`[S1][TRACE:${traceId}] Preferência salva: ${key}`);
    } catch (error) {
      console.error(`[S1][TRACE:${traceId}] Erro ao salvar preferência ${key}:`, error);
      throw error;
    }
  }

  // Auth local (perfis + sessão)
  async createUser(name: string): Promise<number> {
    const result = await this.db!.runAsync(
      'INSERT INTO users (name) VALUES (?)',
      [name.trim()]
    );
    return result.lastInsertRowId as number;
  }

  async createUserWithCredentials(
    name: string,
    email: string,
    salt: string,
    passwordHash: string
  ): Promise<number> {
    const existing = await this.findUserByEmail(email);
    if (existing) {
      throw new Error('EMAIL_TAKEN');
    }
    const result = await this.db!.runAsync(
      'INSERT INTO users (name, email, salt, password_hash) VALUES (?, ?, ?, ?)',
      [name.trim(), email, salt, passwordHash]
    );
    return result.lastInsertRowId as number;
  }

  async findUserByEmail(email: string): Promise<{
    id: number;
    name: string;
    email: string;
    salt: string | null;
    password_hash: string | null;
  } | null> {
    return this.db!.getFirstAsync(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email]
    );
  }

  async getUsers(): Promise<{ id: number; name: string; created_at: string }[]> {
    return this.db!.getAllAsync<{ id: number; name: string; created_at: string }>(
      'SELECT * FROM users ORDER BY created_at ASC'
    );
  }

  async getUserById(id: number): Promise<{ id: number; name: string } | null> {
    return this.db!.getFirstAsync<{ id: number; name: string }>(
      'SELECT id, name FROM users WHERE id = ?',
      [id]
    );
  }

  async getActiveUserId(): Promise<number | null> {
    const row = await this.db!.getFirstAsync<{ value: string }>(
      "SELECT value FROM meta WHERE key = 'active_user_id'"
    );
    const id = row ? Number(row.value) : NaN;
    return Number.isFinite(id) ? id : null;
  }

  async setActiveUserId(id: number | null): Promise<void> {
    if (id === null) {
      await this.db!.runAsync("DELETE FROM meta WHERE key = 'active_user_id'");
      return;
    }
    await this.db!.runAsync(
      `INSERT INTO meta (key, value) VALUES ('active_user_id', ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      [String(id)]
    );
  }

  /**
   * Horário de saída programado, em "HH:MM" (24h), ou null se não houver.
   * Vive na `meta` (chave/valor) em vez de uma tabela nova: é um valor
   * único, e mexer no schema por causa dele custaria migração à toa.
   */
  async getAlarmeSaida(): Promise<string | null> {
    const row = await this.db!.getFirstAsync<{ value: string }>(
      "SELECT value FROM meta WHERE key = 'alarme_saida'"
    );
    return row?.value ?? null;
  }

  async setAlarmeSaida(hora: string | null): Promise<void> {
    if (hora === null) {
      await this.db!.runAsync("DELETE FROM meta WHERE key = 'alarme_saida'");
      return;
    }
    await this.db!.runAsync(
      `INSERT INTO meta (key, value) VALUES ('alarme_saida', ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
      [hora]
    );
  }

  /** Quantos itens do checklist de saída ainda faltam marcar. */
  async countPendenciasSaida(): Promise<number> {
    const row = await this.db!.getFirstAsync<{ total: number }>(
      'SELECT COUNT(*) AS total FROM saida_items WHERE checked = 0'
    );
    return row?.total ?? 0;
  }
}

export default DatabaseSingleton;
