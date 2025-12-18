import { tmdb } from "./tmdb.ts";

async function getTitle(id: string, type: "/images" | "/videos" | "") {
  return await tmdb.fetch(`/movie/${id}${type}`);
}

async function search(searched: string) {
  return await tmdb.fetch(`/search/movie`, `&query=${searched}`);
}

async function tconstFromId(id: string) {
  const res = await title.details(id);
  return res.imdb_id;
}

export const title = {
  images: (id: string) => getTitle(id, "/images"),
  videos: (id: string) => getTitle(id, "/videos"),
  details: (id: string) => getTitle(id, ""),
  search,
  tconstFromId,
};
