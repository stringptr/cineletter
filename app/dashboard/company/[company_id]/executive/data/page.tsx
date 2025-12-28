import { notFound } from "next/navigation";
import { rolesGet } from "@/services/user/role.ts";
import ExecutiveTitleExplorerPage from "./section.tsx";

type Props = {
  params: {
    company_id: string;
    type: string;
  };
};

export default async function ExecutivePage(
  { params }: { params: { company_id: number } },
) {
  const company_id = Number(params.company_id);

  const data = await rolesGet();

  const isAllowed = await data?.company?.some(
    (r) =>
      (r.company_id === company_id || company_id === 0) &&
      r.type === "executive" &&
      r.is_active,
  );

  return isAllowed
    ? <ExecutiveTitleExplorerPage></ExecutiveTitleExplorerPage>
    : notFound();
}
