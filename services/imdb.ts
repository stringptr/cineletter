const IMDB_BASE = "https://api.imdbapi.dev/titles";

async function fetchImdb(
  endpoint: string,
  options: RequestInit = {},
) {
  const url = `${IMDB_BASE}${endpoint}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });

  if (!res.ok) {
    console.error(`IMDb Error: ${res.status} ${res.statusText} from ${url}`);
    return null;
  }

  return res.json();
}

async function getImages(tconst: string) {
  return await fetchImdb(`/${tconst}/images`);
}

async function getDetails(tconst: string) {
  return await fetchImdb(`/${tconst}`);
}

export const imdb = {
  getImages,
  getDetails,
};
