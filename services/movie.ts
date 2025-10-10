import {
  getImages as getImdbImages,
  getTitle as getImdbTitles,
} from "./imdbAPI.ts";

import { getImagesTmdb, imdbToTmdb } from "./tmdbAPI.ts";

export async function getImages(tconst: string) {
  const res = await getImdbImages(tconst);
  const data = await res.json();

  if (!res.ok) {
    return { success: false, error: "error", data: data };
  } else if (data.images === null) {
    return { success: false, error: "null", data: data };
  }

  return { success: true, error: "", data: data };
}

export async function getTitles(tconst: string) {
  const res = await getImdbTitles(tconst);
  const data = await res.json();

  if (!res.ok) {
    return { success: false, error: "error", data: data };
  } else if (data.primaryTitle === null) {
    return { success: false, error: "null", data: data };
  }

  return { success: true, error: "", data: data };
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
