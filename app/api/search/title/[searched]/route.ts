import { search } from "@/services/title/title.ts";

export async function GET(
  req: Request,
  { params }: { params: { searched: string } },
) {
  try {
    const urlParams = new URL(req.url).searchParams;

    const data = await search(
      params.searched,
      Number(urlParams.get("page")) || 1,
      Number(urlParams.get("page_size")) || 20,
      urlParams.get("sort_by") ?? "relevance",
      urlParams.get("invert_sort") === "1",
      urlParams.get("genre") ?? null,
      urlParams.get("type") ?? null,
    );

    return Response.json({ success: true, data });
  } catch (err: any) {
    return Response.json({ success: false, message: err.message }, {
      status: 400,
    });
  }
}
