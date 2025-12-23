"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Card from "@/components/Card";
import { searchDetail } from "@/store/title";

export default function MoviePage() {
  const router = useRouter();
  const [data, setData] = useState<searchDetail[]>([]);
  const [loading, setLoading] = useState(false);

  // route & query
  const searchParams = useSearchParams();

  // filters
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [invertSort, setInvertSort] = useState(false);
  const [genre, setGenre] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // sync from URL → state
  useEffect(() => {
    setSearch(decodeURIComponent(searchParams.get("search") ?? ""));
    setSortBy(searchParams.get("sort_by") ?? "relevance");
    setInvertSort(searchParams.get("invert_sort") === "1");
    setGenre(searchParams.get("genre"));
    setType(searchParams.get("type"));
    setPage(Number(searchParams.get("page") ?? 1));
  }, []);

  // fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const params = new URLSearchParams({
        search: String(search),
        sort_by: sortBy,
        invert_sort: invertSort ? "1" : "0",
        page: String(page),
        page_size: String(pageSize),
      });

      if (search) params.set("search", search);
      if (genre) params.set("genre", genre);
      if (type) params.set("type", type);

      const res = await fetch(
        `/api/title/explore?${params.toString()}`,
      );

      const json = await res.json();

      if (json.success) {
        setData(json.data);
      }

      setLoading(false);
    };

    fetchData();
  }, [search, sortBy, invertSort, genre, type, page]);

  // sync state → URL
  useEffect(() => {
    if (!search) return;

    const params = new URLSearchParams();

    params.set("sort_by", sortBy);
    params.set("invert_sort", invertSort ? "1" : "0");
    params.set("page", String(page));

    if (genre) params.set("genre", genre);
    if (type) params.set("type", type);

    router.replace(
      `/title/explore?${params.toString()}`,
      { scroll: false },
    );
  }, [search, sortBy, invertSort, genre, type, page]);

  return (
    <div className="min-h-screen w-full p-8 flex flex-col gap-6">
      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-4 items-center">
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 rounded-lg bg-[#ffffff0f] text-white border border-[#ffffff1a]"
        >
          <option value="relevance">Relevance</option>
          <option value="rating">Rating</option>
          <option value="rate_count">Popularity</option>
          <option value="year">Year</option>
          <option value="name">Title</option>
        </select>

        <button
          onClick={() => {
            setInvertSort((v) => !v);
            setPage(1);
          }}
          className="px-3 py-2 rounded-lg bg-[#ffffff1a] text-white"
        >
          {invertSort ? "Ascending ↑" : "Descending ↓"}
        </button>

        <select
          value={type ?? ""}
          onChange={(e) => {
            setType(e.target.value || null);
            setPage(1);
          }}
          className="px-3 py-2 rounded-lg bg-[#ffffff0f] text-white border border-[#ffffff1a]"
        >
          <option value="">All Types</option>
          <option value="movie">Movie</option>
          <option value="tvSeries">TV Series</option>
        </select>

        <select
          value={genre ?? ""}
          onChange={(e) => {
            setGenre(e.target.value || null);
            setPage(1);
          }}
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

      <div className="w-full grid gap-4">
        {data.map((m) => <Card key={m.title_id} title_data={m} />)}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-4 py-2 rounded-lg bg-[#ffffff1a] text-white disabled:opacity-40"
        >
          ← Prev
        </button>

        <span className="text-white/70 text-sm">
          Page {page}
        </span>

        <button
          disabled={data.length < pageSize}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 rounded-lg bg-[#ffffff1a] text-white disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
