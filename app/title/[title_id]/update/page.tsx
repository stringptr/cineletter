"use client";

import { useEffect, useState } from "react";

type TabKey =
  | "title"
  | "akas"
  | "genres"
  | "links"
  | "networks"
  | "regions"
  | "languages"
  | "spoken";

const TABS: { key: TabKey; label: string }[] = [
  { key: "title", label: "Title" },
  { key: "akas", label: "Akas" },
  { key: "genres", label: "Genres" },
  { key: "links", label: "Links" },
  { key: "networks", label: "Networks" },
  { key: "regions", label: "Regions" },
  { key: "languages", label: "Languages" },
  { key: "spoken", label: "Spoken Languages" },
];

export default function EditTitlePage({
  params,
}: {
  params: { title_id: string };
}) {
  const { title_id } = params;

  const [activeTab, setActiveTab] = useState<TabKey>("title");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH COMPLETE DATA
  ========================= */
  useEffect(() => {
    fetch(`/api/title/update/${title_id}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [title_id]);

  if (loading) return <p>Loading…</p>;
  if (!data) return <p>{data} Not found</p>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Edit Title: {title_id}</h1>

      {/* ---------- Tabs ---------- */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: "6px 12px",
              borderBottom: activeTab === t.key
                ? "2px solid black"
                : "2px solid transparent",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ---------- Content ---------- */}
      {activeTab === "title" && (
        <TitleTab title={data.title} title_id={title_id} />
      )}
      {activeTab === "akas" && (
        <AkasTab akas={data.title_akas} title_id={title_id} />
      )}
      {activeTab === "genres" && (
        <GenresTab genres={data.title_genres} title_id={title_id} />
      )}
      {activeTab === "links" && (
        <LinksTab links={data.title_links} title_id={title_id} />
      )}
      {activeTab === "networks" && (
        <NetworksTab networks={data.title_networks} title_id={title_id} />
      )}
      {activeTab === "regions" && (
        <RegionsTab regions={data.title_regions} title_id={title_id} />
      )}
      {activeTab === "languages" && (
        <LanguagesTab languages={data.title_languages} title_id={title_id} />
      )}
      {activeTab === "spoken" && (
        <SpokenLanguagesTab
          spoken={data.title_spoken_languages}
          title_id={title_id}
        />
      )}
    </div>
  );
}

/* ======================================================
   INDIVIDUAL TABS
====================================================== */

function TitleTab({ title, title_id }: any) {
  const [form, setForm] = useState(title);

  async function save() {
    await fetch(`/api/titles/${title_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    alert("Saved");
  }

  return (
    <section>
      <label>
        Title
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
      </label>

      <label>
        Overview
        <textarea
          value={form.overview}
          onChange={(e) => setForm({ ...form, overview: e.target.value })}
        />
      </label>

      <button onClick={save}>Save Title</button>
    </section>
  );
}

function AkasTab({ akas, title_id }: any) {
  async function save(aka: any) {
    await fetch(`/api/titles/${title_id}/akas`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aka),
    });
    alert("Saved");
  }

  return (
    <ul>
      {akas.map((a: any) => (
        <li key={a.ordering}>
          <input defaultValue={a.title} />
          <button onClick={() => save(a)}>Save</button>
        </li>
      ))}
    </ul>
  );
}

function GenresTab({ genres, title_id }: any) {
  return (
    <ul>
      {genres.map((g: any) => <li key={g.genre}>{g.genre}</li>)}
    </ul>
  );
}

function LinksTab({ links, title_id }: any) {
  return (
    <ul>
      {links.map((l: any) => (
        <li key={l.link}>
          {l.link_type}: {l.link}
        </li>
      ))}
    </ul>
  );
}

function NetworksTab({ networks }: any) {
  return (
    <ul>
      {networks.map((n: any) => <li key={n.network_id}>{n.network_id}</li>)}
    </ul>
  );
}

function RegionsTab({ regions }: any) {
  return (
    <ul>
      {regions.map((r: any, i: number) => (
        <li key={i}>
          {r.production_region_code} → {r.origin_region_code}
        </li>
      ))}
    </ul>
  );
}

function LanguagesTab({ languages }: any) {
  return (
    <ul>
      {languages.map((l: any) => (
        <li key={l.language_code}>{l.language_code}</li>
      ))}
    </ul>
  );
}

function SpokenLanguagesTab({ spoken }: any) {
  return (
    <ul>
      {spoken.map((s: any) => (
        <li key={s.spoken_language_id}>{s.spoken_language_id}</li>
      ))}
    </ul>
  );
}
