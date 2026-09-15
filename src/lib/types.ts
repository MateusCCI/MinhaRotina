export interface InboxItem {
  id: number;
  content: string;
  created_at: string;
}

export interface HojeItem {
  id: number;
  inbox_id: number;
  created_at: string;
  content?: string;
  checked?: number | boolean;
}

export interface SaidaItem {
  id: number;
  content: string;
  checked: boolean;
}

export interface WeeklyStats {
  inboxZerado: number;
  totalSaidas: number;
  mediaSaida: string;
}
