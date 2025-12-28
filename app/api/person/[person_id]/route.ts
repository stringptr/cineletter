import { NextResponse } from "next/server";
import { getPersonDetails } from "@/services/person/main";

export const dynamic = "force-dynamic";

export async function GET(
  _: Request,
  { params }: { params: { person_id: string } },
) {
  try {
    const data = await getPersonDetails(params.person_id);
    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 404 },
    );
  }
}
