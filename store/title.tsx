export type searchDetail = {
  title_id: string;
  title: string | null;
  overview: string | null;
  tagline: string | null;
  rate_count: number | null;
  average_rating: number | null;
  start_year: number | null;
  type: string;
  relevance: string;
  title_akas: { title: string }[];
};
