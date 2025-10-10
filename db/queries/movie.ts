export async function getImages(tconst: string) {
  const url = `https://api.imdbapi.dev/titles/${tconst}/images`;
  const res = await fetch(url);
  const data = await res.json();

  return Response.json(data);
}
