import { tmdb } from "./tmdb.ts";

async function getDetails(id: string) {
  return await tmdb.fetchTmdb(`person/${id}`);
}

async function getImages(id: string) {
  return await tmdb.fetchTmdb(`person/${id}`);
}

async function getCombinedCredit(id: string) {
  return await tmdb.fetchTmdb(`person/${id}/combined_credits`);
}

async function getMovieCredit(id: string) {
  return await tmdb.fetchTmdb(`person/${id}/movie_credits`);
}

export const person = {
  getDetails,
  getImages,
  getMovieCredit,
  getCombinedCredit,
};
