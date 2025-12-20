import process from "node:process";

import { title } from "./tmdb_title.ts";
import { person } from "./tmdb_person.ts";
import { trending } from "./tmdb_trending.ts";

const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_KEY = process.env.TMDB_API_KEY;

async function fetchTmdb(
  endpoint1: string,
  endpoint2?: string | null,
  tags?: string | null,
  options: RequestInit = {},
) {
  const url = `${TMDB_BASE}${endpoint1}?api_key=${TMDB_KEY}${endpoint2 ?? ""}`;
  const res = await fetch(url, {
    ...options,
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    console.error(`TMDB Error: ${res.status} ${res.statusText} from ${url}`);
    return null;
  }

  return res.json();
}

async function idFromImdb(tconst: string, type: "person" | "movie" | "tv") {
  const res = await fetchTmdb(
    `/find/${tconst}`,
    `&external_source=imdb_id`,
  );

  if (res === null) {
    return null;
  }

  switch (type) {
    case "person":
      return await res.person_results[0].id;
    case "movie":
      return await res?.movie_results[0]?.id;
    case "tv":
      return await res.tv_results[0].id;
    default:
  }
}

export const tmdb = {
  fetch: fetchTmdb,
  idFromImdb,
  title,
  person,
  trending,
};
