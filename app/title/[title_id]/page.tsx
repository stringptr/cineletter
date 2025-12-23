import DetailMovie from "@/components/DetailMovie.tsx";

export default async function MovieDetailPage({
  params,
}: {
  params: { title_id: string };
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/title/${params.title_id}`,
    {
      cache: "force-cache",
      next: {
        tags: [`title_detail:${params.title_id}`],
      },
    },
  );

  const data = await res.json();

  return <DetailMovie movie={data.data} />;
}
