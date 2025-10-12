import { tmdb } from "./tmdb.ts";

async function getPerson(
  id: string,
  type:
    | null
    | "/images"
    | "/videos"
    | "/movie_credits"
    | "/tv_credits"
    | "/combined_credits",
) {
  return await tmdb.fetch(`/person/${id}${type}`);
}

export const person = {
  details: (id: string) => getPerson(id, null),
  images: (id: string) => getPerson(id, "/images"),
  credits: (id: string, type: "combined" | "movie" | "tv") =>
    getPerson(id, `/${type}_credits`),
};
