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
