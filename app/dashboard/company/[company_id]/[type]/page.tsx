import { notFound } from "next/navigation";
import { rolesGet } from "@/services/user/role.ts";
import ExecutivePage from "./_sections/ExecutivePage";
import MarketingPage from "./_sections/MarketingPage";

type Props = {
  params: {
    company_id: string;
    type: string;
  };
};

export default async function CompanyDashboardPage({ params }: Props) {
  const company_id = Number(params.company_id);
  const type = params.type;

  const roles = await rolesGet();

  const allowed = roles?.company?.some(
    (r) =>
      (r.company_id === company_id || company_id === 0) &&
      r.type === type &&
      r.is_active,
  );

  if (!allowed) notFound();

  switch (type) {
    case "executive":
      return <ExecutivePage companyId={Number(company_id)} />;

    case "marketing":
      return <MarketingPage companyId={Number(company_id)} />;

    default:
      notFound();
  }
}
