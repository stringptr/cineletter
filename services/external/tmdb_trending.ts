import { tmdb } from "./tmdb.ts";

async function getTrending(
  type: "all" | "movie" | "tv" | "person",
  time_window: "day" | "week",
) {
  return await tmdb.fetch(`/trending/${type}/${time_window}`);
}

export const trending = {
  all: (time_window: "day" | "week") => getTrending("all", time_window),
  movie: (time_window: "day" | "week") => getTrending("movie", time_window),
  tv: (time_window: "day" | "week") => getTrending("tv", time_window),
  person: (time_window: "day" | "week") => getTrending("person", time_window),
};
