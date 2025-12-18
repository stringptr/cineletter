import * as title from "@/services/title.ts";

export async function GET(
  _req: Request,
  context: { params: Promise<{ title_id: string }> },
) {
  try {
    const data = await title.getDetails((await context.params).title_id);
    return Response.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    if (err.message.includes("not found")) {
      return Response.json({ success: false, error: err.message }, {
        status: 404,
      });
    }

    return Response.json({ success: false, error: err.message }, {
      status: 500,
    });
  }
}
