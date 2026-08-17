export interface Book {
  name: string;
  lang: string;
  devaName?: string;
  by?: string;
  links: { label: string; url: string }[];
}

export interface Philosopher {
  name: string;
  category: "Indian" | "Greek" | "Chinese" | "Western";
  dates: string;
  majorWork: string;
  description: string;
  quote?: string;
}

export interface TimelineEvent {
  date: string;
  name: string;
  desc: string;
  isBig: boolean;
  category?: "civilization" | "spiritual" | "knowledge";
}
