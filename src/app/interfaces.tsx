export interface HistoryProps {
  date: string;
  queries: Array<{
    query: string;
    time: string;
  }>;
}

export interface DocumentsProps {
  id: string;
  title: string;
  preview?: string;
  content?: string;
  score?: number;
}

export interface DeocumentsResponseProps {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  data: Array<DocumentsProps>;
}
