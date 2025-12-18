"use client";

import { useParams } from "next/navigation";
import useSWR from "swr";
import DetailMovie from "@/components/DetailMovie";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Not found");
    return res.json();
  });

export default function MovieDetailPage() {
  const { title_id } = useParams<{ title_id: string }>();

  const { data, error, isLoading } = useSWR(
    title_id ? `/api/title/${title_id}` : null,
    fetcher,
  );

  if (isLoading) {
    return <p className="text-white text-center py-20">Loading…</p>;
  }

  if (error || !data?.success) {
    return (
      <p className="text-white text-center py-20">
        Movie not found
      </p>
    );
  }

  return <DetailMovie movie={data.data} />;
}
