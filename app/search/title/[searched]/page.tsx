"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Card from "@/components/Card";
import { searchDetail } from "@/types/title";

export default function MoviePage() {
  const router = useRouter();
  const [data, setData] = useState<searchDetail[]>([]);
  const [loading, setLoading] = useState(false);

  // filters
  const params = useParams<{ searched: string }>();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [invertSort, setInvertSort] = useState(false);
  const [genre, setGenre] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);

  useEffect(() => {
    if (!params.searched) return;

    setSearch(decodeURIComponent(params.searched));
    setSortBy(searchParams.get("sort_by") ?? "relevance");
    setInvertSort(searchParams.get("invert_sort") === "1");
    setGenre(searchParams.get("genre"));
    setType(searchParams.get("type"));
  }, [params.searched]);

  useEffect(() => {
    if (!search) return;

    const fetchData = async () => {
      setLoading(true);

      const params = new URLSearchParams({
        sort_by: sortBy,
        invert_sort: invertSort ? "1" : "0",
      });

      if (genre) params.set("genre", genre);
      if (type) params.set("type", type);

      const res = await fetch(
        `/api/search/title/${encodeURIComponent(search)}?${params.toString()}`,
      );

      const json = await res.json();

      if (json.success) {
        setData(json.data);
      }

      setLoading(false);
    };

    fetchData();
  }, [search, sortBy, invertSort, genre, type]);

  useEffect(() => {
    if (!search) return;

    const params = new URLSearchParams();

    params.set("sort_by", sortBy);
    params.set("invert_sort", invertSort ? "1" : "0");

    if (genre) params.set("genre", genre);
    if (type) params.set("type", type);

    router.replace(
      `/search/title/${encodeURIComponent(search)}?${params.toString()}`,
      { scroll: false },
    );
  }, [search, sortBy, invertSort, genre, type]);

  return (
    <div className="min-h-screen w-full p-8 flex flex-col gap-6">
      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* SORT */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 rounded-lg bg-[#ffffff0f] text-white border border-[#ffffff1a]"
        >
          <option value="relevance">Relevance</option>
          <option value="rating">Rating</option>
          <option value="rate_count">Popularity</option>
          <option value="year">Year</option>
          <option value="name">Title</option>
        </select>

        {/* ORDER */}
        <button
          onClick={() => setInvertSort((v) => !v)}
          className="px-3 py-2 rounded-lg bg-[#ffffff1a] text-white"
        >
          {invertSort ? "Ascending ↑" : "Descending ↓"}
        </button>

        {/* TYPE */}
        <select
          value={type ?? ""}
          onChange={(e) => setType(e.target.value || null)}
          className="px-3 py-2 rounded-lg bg-[#ffffff0f] text-white border border-[#ffffff1a]"
        >
          <option value="">All Types</option>
          <option value="movie">Movie</option>
          <option value="tvSeries">TV Series</option>
        </select>

        {/* GENRE */}
        <select
          value={genre ?? ""}
          onChange={(e) => setGenre(e.target.value || null)}
          className="px-3 py-2 rounded-lg bg-[#ffffff0f] text-white border border-[#ffffff1a]"
        >
          <option value="">All Genres</option>
          <option value="Drama">Drama</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Comedy">Comedy</option>
          <option value="Musical">Musical</option>
        </select>
      </div>

      {/* RESULTS */}
      {loading && <p className="text-white/60">Loading...</p>}

      <div className="w-full">
        {data.map((m) => (
          <Card
            key={m.title_id}
            title_data={m}
          />
        ))}
      </div>
    </div>
  );
}
