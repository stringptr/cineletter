"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { searchDetail } from "@/store/title";
import { Capitalize } from "@/lib/string.ts";

export default function MoviePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // data
  const [data, setData] = useState<searchDetail[]>([]);
  const [loading, setLoading] = useState(false);

  // init guard
  const [initialized, setInitialized] = useState(false);

  // filters
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [invertSort, setInvertSort] = useState(false);
  const [primaryProfession, setPrimaryProfession] = useState<string | null>(
    null,
  );

  // pagination
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // attributes
  const [attributes, setAttributes] = useState<{
    primary_professions: any[];
  }>({
    primary_professions: [],
  });

  /* ---------------------------------------------
   * Load attributes (cached)
   * -------------------------------------------*/
  useEffect(() => {
    const fetchAttributes = async () => {
      const [primary_professions] = await Promise.all([
        fetch("/api/person/attribute/primary_profession", {
          cache: "force-cache",
          next: { tags: ["attribute-primary-professions"] },
        }).then((r) => r.json()),
      ]);

      setAttributes({ primary_professions });
    };

    fetchAttributes();
  }, []);

  /* ---------------------------------------------
   * URL → State (reactive)
   * -------------------------------------------*/
  useEffect(() => {
    setSearch(searchParams.get("search") ?? "");
    setPrimaryProfession(searchParams.get("primary_profession") ?? "");
    setSortBy(searchParams.get("sort_by") ?? "relevance");
    setInvertSort(searchParams.get("invert_sort") === "1");
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
      if (primaryProfession) {
        params.set("primary_profession", primaryProfession);
      }

      const res = await fetch(
        `/api/person/explore?${params.toString()}`,
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
  }, [initialized, search, sortBy, invertSort, primaryProfession, page]);

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

    if (primaryProfession) params.set("primary_professions", primaryProfession);
    console.log(params);
    router.replace(`/person/explore?${params.toString()}`, {
      scroll: false,
    });
  }, [initialized, search, sortBy, invertSort, primaryProfession, page]);

  return (
    <main className="min-h-screen bg-[#0a0a1a] text-white -mt-20 pt-28 pb-10">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="flex flex-col justify-between items-end mb-8 border-b border-[#ffffff1a] pb-4 gap-4">
          <div className="w-full">
            <h1 className="text-4xl font-extrabold mb-2">Person</h1>
            <p className="text-gray-400 text-sm">
              Discover popular actors, directors, and crew.
            </p>
          </div>

          <div className="w-full flex flex-col gap-4">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearch(input.trim());
                  setPage(1);
                }
              }}
              placeholder={search ?? "Search titles…"}
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
                <option value="name">Name</option>
                <option value="birth_year">Birth Year</option>
                <option value="death_year">Death Year</option>
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
                value={primaryProfession ?? ""}
                onChange={(e) => {
                  setPrimaryProfession(e.target.value || null);
                  setPage(1);
                }}
                className="px-3 py-2 rounded-lg bg-[#ffffff0f] text-white border border-[#ffffff1a]"
              >
                <option value="">All Primary Professions</option>
                {attributes.primary_professions.map((g) => (
                  <option
                    key={g.primary_profession}
                    value={g.primary_profession}
                  >
                    {Capitalize(g.primary_profession.replace("_", " "))}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* SEARCH */}

        {/* RESULTS */}
        {loading && <p className="text-white/60">Loading…</p>}

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-3 relative z-0">
          {data.map((p) => (
            <Link
              key={p.person_id}
              href={`/person/${p.person_id}`}
              className="group relative bg-[#1a1d26] rounded-lg overflow-hidden hover:-translate-y-1 transition-transform duration-300 shadow-md no-underline"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={p.image ?? null}
                  alt={p.person_name ?? "Unknown"}
                  fill
                  className="object-cover transition-opacity duration-300 group-hover:opacity-90 bg-gray-800"
                />
              </div>

              <div className="p-2 text-center">
                <h3 className="text-xs font-bold text-white truncate group-hover:text-[#ff3b3b] transition-colors">
                  {p.person_name ?? "Unknown"}
                </h3>
                <p
                  hidden
                  className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wide"
                >
                </p>
              </div>
            </Link>
          ))}
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
    </main>
  );
}
