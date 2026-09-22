export interface InboxItem {
  id: number;
  content: string;
  created_at: string;
  due_date?: string | null;
  category?: string | null;
}

export interface HojeItem {
  id: number;
  inbox_id: number;
  created_at: string;
  content?: string;
  checked?: number | boolean;
  due_date?: string | null;
  category?: string | null;
}

export interface SaidaItem {
  id: number;
  content: string;
  checked: boolean;
  checked_at?: string | null;
}

export interface SaidaLog {
  id: number;
  saiu_at: string;
}

export interface WeeklyStats {
  inboxZerado: number;
  totalSaidas: number;
  mediaSaida: string;
}
