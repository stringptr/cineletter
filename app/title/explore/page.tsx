"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Card from "@/components/Card";
import { searchDetail } from "@/store/title";

export default function MoviePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // data
  const [data, setData] = useState<searchDetail[]>([]);
  const [loading, setLoading] = useState(false);

  // init guard
  const [initialized, setInitialized] = useState(false);

  // filters
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [invertSort, setInvertSort] = useState(false);
  const [genre, setGenre] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // attributes
  const [attributes, setAttributes] = useState<{
    genres: any[];
    types: any[];
  }>({
    genres: [],
    types: [],
  });

  /* ---------------------------------------------
   * Load attributes (cached)
   * -------------------------------------------*/
  useEffect(() => {
    const fetchAttributes = async () => {
      const [genres, types] = await Promise.all([
        fetch("/api/title/attribute/genre", {
          cache: "force-cache",
          next: { tags: ["attribute-genres"] },
        }).then((r) => r.json()),
        fetch("/api/title/attribute/type", {
          cache: "force-cache",
          next: { tags: ["attribute-types"] },
        }).then((r) => r.json()),
      ]);

      setAttributes({ genres, types });
    };

    fetchAttributes();
  }, []);

  /* ---------------------------------------------
   * URL → State (reactive)
   * -------------------------------------------*/
  useEffect(() => {
    setSearch(searchParams.get("search") ?? "");
    setSortBy(searchParams.get("sort_by") ?? "relevance");
    setInvertSort(searchParams.get("invert_sort") === "1");
    setGenre(searchParams.get("genre"));
    setType(searchParams.get("type"));
    setPage(Number(searchParams.get("page") ?? 1));

    setInitialized(true);
  }, [searchParams]);

  /* ---------------------------------------------
   * Fetch data
   * -------------------------------------------*/
  useEffect(() => {
    if (!initialized) return;

    const fetchData = async () => {
      setLoading(true);

      const params = new URLSearchParams({
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
        {
          cache: "force-cache",
          next: { tags: [`explore-${params.toString()}`], revalidate: 3600 },
        },
      );

      const json = await res.json();
      if (json?.success) setData(json.data);
      else setData([]);

      setLoading(false);
    };

    fetchData();
  }, [initialized, search, sortBy, invertSort, genre, type, page]);

  /* ---------------------------------------------
   * State → URL (after init)
   * -------------------------------------------*/
  useEffect(() => {
    if (!initialized) return;

    const params = new URLSearchParams();

    if (search) params.set("search", search);
    params.set("sort_by", sortBy);
    params.set("invert_sort", invertSort ? "1" : "0");
    params.set("page", String(page));

    if (genre) params.set("genre", genre);
    if (type) params.set("type", type);

    router.replace(`/title/explore?${params.toString()}`, {
      scroll: false,
    });
  }, [initialized, search, sortBy, invertSort, genre, type, page]);

  return (
    <div className="min-h-screen w-full p-8 flex flex-col gap-6">
      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        placeholder="Search titles…"
        className="w-full px-4 py-3 rounded-xl bg-[#ffffff0f] text-white border border-[#ffffff1a]"
      />

      {/* FILTERS */}
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
          {attributes.types.map((t) => (
            <option key={t.type_name} value={t.type_name}>
              {t.type_name}
            </option>
          ))}
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
          {attributes.genres.map((g) => (
            <option key={g.genre_name} value={g.genre_name}>
              {g.genre_name}
            </option>
          ))}
        </select>
      </div>

      {/* RESULTS */}
      {loading && <p className="text-white/60">Loading…</p>}

      <div className="grid gap-4">
        {data.map((m) => <Card key={m.title_id} title_data={m} />)}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-4 py-2 rounded-lg bg-[#ffffff1a] text-white disabled:opacity-40"
        >
          ← Prev
        </button>

        <span className="text-white/70 text-sm">Page {page}</span>

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
