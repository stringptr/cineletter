import { getAllTitleCompany } from "@/services/dashboard/executive";

export async function GET(
  req: Request,
  { params }: { params: { company_id: string } },
) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams;

    const data = await getAllTitleCompany(
      Number(params.company_id), // ✅ company_id from path
      q.get("q") ?? "", // ✅ optional search
      Number(q.get("page")) || 1,
      Number(q.get("page_size")) || 20,
      q.get("sort_by") ?? "relevance",
      q.get("invert_sort") === "1",
      q.get("genre"),
      q.get("type"),
    );

    return Response.json({ success: true, data });
  } catch (err: any) {
    return Response.json(
      { success: false, message: err.message },
      { status: 400 },
    );
  }
}
