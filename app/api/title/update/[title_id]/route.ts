import { completeDataGet } from "@/services/title/title.ts";

export async function GET(
  _req: Request,
  context: { params: Promise<{ title_id: string }> },
) {
  const data = await completeDataGet((await context.params).title_id);
  return Response.json(data);
}
