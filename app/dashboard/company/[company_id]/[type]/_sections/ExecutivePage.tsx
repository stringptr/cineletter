"use client";
import { notFound } from "next/navigation";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Card from "@/components/Card";
import { searchDetail } from "@/store/title";

export default function ExecutiveTitleExplorerPage() {
  const router = useRouter();
  const params = useParams<{ company_id: string }>();
  const searchParams = useSearchParams();

  const companyId = Number(params.company_id);

  const [data, setData] = useState<searchDetail[]>([]);
  const [loading, setLoading] = useState(false);

  // filters
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [invertSort, setInvertSort] = useState(false);
  const [genre, setGenre] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);

  /* ---------------------------------------------
   * Init from query params
   * -------------------------------------------*/
  useEffect(() => {
    setSearch(searchParams.get("q") ?? "");
    setSortBy(searchParams.get("sort_by") ?? "year");
    setInvertSort(searchParams.get("invert_sort") === "1");
    setGenre(searchParams.get("genre"));
    setType(searchParams.get("type"));
  }, []);

  /* ---------------------------------------------
   * Fetch executive titles
   * -------------------------------------------*/
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
          sort_by: sortBy,
          invert_sort: invertSort ? "1" : "0",
        });

        if (search) params.set("q", search);
        if (genre) params.set("genre", genre);
        if (type) params.set("type", type);

        const res = await fetch(
          `/api/company/${companyId}/executive?${params.toString()}`,
        );

        const json = await res.json();

        if (json?.success) {
          setData(json.data);
        } else {
          setData([]);
        }

        setLoading(false);
      } catch (error: any) {
        if (error?.number === 50001) {
          notFound();
        }
        console.error("Failed to fetch dashboard data:", error);
      }
    };

    fetchData();
  }, [companyId, search, sortBy, invertSort, genre, type]);

  /* ---------------------------------------------
   * Sync URL (no navigation)
   * -------------------------------------------*/
  useEffect(() => {
    const params = new URLSearchParams();

    if (search) params.set("q", search);
    params.set("sort_by", sortBy);
    params.set("invert_sort", invertSort ? "1" : "0");
    if (genre) params.set("genre", genre);
    if (type) params.set("type", type);

    router.replace(
      `/dashboard/company/${companyId}/executive?${params.toString()}`,
      { scroll: false },
    );
  }, [search, sortBy, invertSort, genre, type]);

  return (
    <div className="min-h-screen w-full p-8 flex flex-col gap-6">
      {/* SEARCH BAR */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search titles (optional)…"
        className="w-full px-4 py-3 rounded-xl bg-[#ffffff0f] text-white border border-[#ffffff1a] outline-none"
      />

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
      {loading && <p className="text-white/60">Loading…</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((title) => (
          <div
            key={title.title_id}
            onClick={() => router.push(`/title/${title.title_id}/update`)}
            className="cursor-pointer"
          >
            <Card title_data={title} />
          </div>
        ))}
      </div>
    </div>
  );
}
