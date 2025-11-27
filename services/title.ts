import { imdb } from "./imdb.ts";
import { tmdb } from "./tmdb.ts";
import * as title from "@/db/queries/title.ts";

export async function getImages(title_id: string) {
  const res = await imdb.getImages(title_id);
  if (!res.ok) throw new Error("Failed to fetch images");

  const data = await res.json();
  return data;
}

export async function getDetails(title_id: string) {
  const res = await title.getDetails(title_id);
  return res;
}

export async function getTmdbTitle(tconst: string) {
  const tmdb_res = await imdbToTmdb(tconst);

  if (tmdb_res === null) {
    return { success: false, error: "external-not-found", data: {} };
  }

  const tmdb_json = await tmdb_res.json();
  const tmdb_id = await tmdb_json.movie_results[0].id;

  const res = await getImagesTmdb(tmdb_id);
  if (res === null) return { success: false, error: "not-found", data: {} };

  const data = await res.json();
  return { success: true, error: "", data: data };
}
