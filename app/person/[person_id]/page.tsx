import { getPersonDetails } from "@/services/person/main";
import PersonDetailPage from "./person-client";

export default async function Page({
  params,
}: {
  params: { person_id: string };
}) {
  const person = await getPersonDetails(params.person_id);
  return <PersonDetailPage person={person} />;
}
