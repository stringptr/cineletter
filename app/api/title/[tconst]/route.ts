import { getImages } from "@/services/movieService.ts";

export async function GET(
  req: Request,
  { params }: { params: { tconst: string } },
) {
  const tconst = params;
  const res = await getImages(tconst.tconst);
  return Response.json(res);
}
