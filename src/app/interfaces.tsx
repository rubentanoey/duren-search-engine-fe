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

export interface WeatherDataProps {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  clouds: {
    all: number;
    visibility: number;
    wind: {
      speed: number;
      deg: number;
      gust: number;
    };
  };
}
