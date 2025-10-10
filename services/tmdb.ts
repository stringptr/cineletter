import process from "node:process";

const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_KEY = process.env.TMDB_API_KEY;

async function fetchTmdb(
  endpoint1: string,
  endpoint2?: string,
  options: RequestInit = {},
) {
  const url = `${TMDB_BASE}${endpoint1}?api_key=${TMDB_KEY}${endpoint2 ?? ""}`;
  const res = await fetch(url, { ...options, next: { revalidate: 3600 } });

  if (!res.ok) {
    console.error(`TMDB Error: ${res.status} ${res.statusText} from ${url}`);
    return null;
  }

  return res.json();
}

async function getImages(id: string) {
  return await fetchTmdb(`/movie/${id}/images`);
}

async function getDetails(id: string) {
  return await fetchTmdb(`/movie/${id}`);
}

async function getVideos(id: string) {
  return await fetchTmdb(`/movie/${id}/videos`);
}

async function idFromImdb(tconst: string) {
  const res = await fetchTmdb(
    `/find/${tconst}`,
    `&external_source=imdb_id`,
  );

  if (res === null) {
    return null;
  }

  const id = res.movie_results[0].id;
  return id;
}

async function search(query: string) {
  return await fetchTmdb(`/search/movie&query=${encodeURIComponent(query)}`);
}

export const tmdb = {
  getImages,
  getDetails,
  getVideos,
  idFromImdb,
  search,
};
