import { tmdb } from "./tmdb.ts";

async function getImages(id: string) {
  return await tmdb.fetchTmdb(`/movie/${id}/images`);
}

async function getDetails(id: string) {
  return await tmdb.fetchTmdb(`/movie/${id}`);
}

async function getVideos(id: string) {
  return await tmdb.fetchTmdb(`/movie/${id}/videos`);
}

async function search(searched: string) {
  return await tmdb.fetchTmdb(`/search/movie`, `&query=${searched}`);
}

async function tconstFromId(id: string) {
  const res = await getDetails(id);
  return res.imdb_id;
}

export const title = {
  getImages,
  getDetails,
  getVideos,
  search,
  tconstFromId,
};
