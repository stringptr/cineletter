"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import { titleCompleteUpdateSchema } from "@/schemas/title/update";
import { titleCompleteSchema } from "@/schemas/title/base.ts";

export default function TitleUpdatePage() {
  const { title_id } = useParams();
  const [data, setData] = useState<
    z.infer<typeof titleCompleteUpdateSchema> | null
  >(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/title/${title_id}/update`, {
      cache: "force-cache",
      next: { tags: [`title_data:${title_id}`] },
    })
      .then((r) => r.json())
      .then((e) => ({
        ...e,
        title_genres: e.title_genres?.map((g: any) => ({
          ...g,
          genre_old: g.genre,
          genre_new: g.genre,
        })) || [],
        title_links: e.title_links?.map((l: any) => ({
          ...l,
          link_type_old: l.link_type,
          link_old: l.link,
          link_type_new: l.link_type,
          link_new: l.link,
        })) || [],
        title_networks: e.title_networks?.map((n: any) => ({
          ...n,
          network_id_old: n.network_id,
          network_id_new: n.network_id,
        })) || [],
        title_languages: e.title_languages?.map((l: any) => ({
          ...l,
          language_code_old: l.language_code,
          language_code_new: l.language_code,
        })) || [],
        title_regions: e.title_regions?.map((r: any) => ({
          ...r,
          production_region_code_old: r.production_region_code,
          origin_region_code_old: r.origin_region_code,
          production_region_code_new: r.production_region_code,
          origin_region_code_new: r.origin_region_code,
        })) || [],
        title_spoken_languages: e.title_spoken_languages?.map((s: any) => ({
          ...s,
          spoken_language_id_old: e.spoken_language_id,
          spoken_language_id_new: e.spoken_language_id,
        })) || [],
      }))
      .then((s) => setData(s))
      .then(() => console.log(data))
      .finally(() => setLoading(false));
  }, [title_id]);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data found</div>;

  // Generic handler to update per table
  const handleSave = async (tableKey: keyof typeof data) => {
    if (!data) return;
    setSaving(true);
    try {
      // Prepare payload based on table
      const payload: any = {};
      switch (tableKey) {
        case "title":
          payload.details = data.title;
          break;
        case "title_akas":
          payload.akas = data.title_akas;
          break;
        case "title_genres":
          payload.genres = data.title_genres?.filter((g) =>
            g.genre_new !== g.genre_old
          );
          break;
        case "title_links":
          payload.links = data.title_links?.filter((f) =>
            f.link_old !== f.link_new || f.link_type_new !== f.link_type_new
          );
          break;
        case "title_networks":
          payload.networks = data.title_networks?.filter((n) =>
            n.network_id_new !== n.network_id_old
          );
          break;
        case "title_regions":
          payload.regions = data.title_regions?.filter((r) =>
            r.origin_region_code_new !== r.origin_region_code_old ||
            r.production_region_code_old !== r.production_region_code_new
          );
          break;
        case "title_spoken_languages":
          payload.spokenLanguages = data.title_spoken_languages?.filter((s) =>
            s.spoken_language_id_new !== s.spoken_language_id_old
          );
          break;
        case "title_languages":
          payload.languages = data.title_languages?.filter((l) =>
            l.language_code_new !== l.language_code_old
          );
          break;
      }

      const res = await fetch(`/api/title/${title_id}/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) {
        alert("Save failed: " + (json.error || "Unknown error"));
      } else {
        await fetch(`/api/title/${title_id}/invalidate`);
        alert("Saved successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving");
    } finally {
      setSaving(false);
    }
  };

  // Save all tables
  const handleSaveAll = async () => {
    if (!data) return;
    setSaving(true);
    try {
      const payload = {
        details: data.title,
        akas: data.title_akas,
        genres: data.title_genres,
        links: data.title_links,
        networks: data.title_networks,
        regions: data.title_regions,
        spokenLanguages: data.title_spoken_languages,
        languages: data.title_languages,
      };

      const res = await fetch(`/api/title/${title_id}/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!json.success) {
        alert("Save failed: " + (json.error || "Unknown error"));
      } else {
        await fetch(`/api/title/${title_id}/invalidate`);
        alert("Saved successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col w-[40vw] items-center px-auto mx-auto">
      <h1>Update Title: {data.title.title_id}</h1>

      {/* Title */}
      <div className="flex flex-col">
        <h2>Title Details</h2>
        <input
          type="text"
          value={data.title.title || ""}
          onChange={(e) =>
            setData({
              ...data,
              title: { ...data.title, title: e.target.value },
            })}
        />
        <input
          type="text"
          value={data.title?.original_title || ""}
          onChange={(e) =>
            setData({
              ...data,
              title: { ...data.title, original_title: e.target.value },
            })}
        />
        <input
          type="text"
          value={data.title?.tagline || ""}
          onChange={(e) =>
            setData({
              ...data,
              title: { ...data.title, tagline: e.target.value },
            })}
        />
        <input
          type="text"
          value={data.title?.overview || ""}
          onChange={(e) =>
            setData({
              ...data,
              title: { ...data.title, overview: e.target.value },
            })}
        />
        <input
          type="text"
          value={data.title?.runtime_minute || ""}
          onChange={(e) =>
            setData({
              ...data,
              title: { ...data.title, runtime_minute: e.target.value },
            })}
        />
        <input
          type="text"
          value={data.title?.start_year || ""}
          onChange={(e) =>
            setData({
              ...data,
              title: { ...data.title, start_year: e.target.value },
            })}
        />
        <input
          type="text"
          value={data.title?.end_year || ""}
          onChange={(e) =>
            setData({
              ...data,
              title: { ...data.title, end_year: e.target.value },
            })}
        />
        <input
          type="text"
          value={data.title?.episode_number || ""}
          onChange={(e) =>
            setData({
              ...data,
              title: { ...data.title, episode_number: e.target.value },
            })}
        />
        <input
          type="text"
          value={data.title?.season_number || ""}
          onChange={(e) =>
            setData({
              ...data,
              title: { ...data.title, season_number: e.target.value },
            })}
        />
        <button onClick={() => handleSave("title")} disabled={saving}>
          Save Title
        </button>
      </div>

      {/* AKAs */}
      <div>
        <h2>AKAs</h2>
        {data.title_akas?.map((aka, idx) => (
          <div key={idx}>
            <input
              type="text"
              value={aka.title}
              onChange={(e) => {
                const newAkas = [...(data.title_akas || [])];
                newAkas[idx] = { ...aka, title: e.target.value };
                setData({ ...data, title_akas: newAkas });
              }}
            />
            <input
              type="text"
              value={aka.language}
              onChange={(e) => {
                const newAkas = [...(data.title_akas || [])];
                newAkas[idx] = { ...aka, language: e.target.value };
                setData({ ...data, title_akas: newAkas });
              }}
            />
            <input
              type="text"
              value={aka.region}
              onChange={(e) => {
                const newAkas = [...(data.title_akas || [])];
                newAkas[idx] = { ...aka, region: e.target.value };
                setData({ ...data, title_akas: newAkas });
              }}
            />
          </div>
        ))}
        <button onClick={() => handleSave("title_akas")} disabled={saving}>
          Save AKAs
        </button>
      </div>

      {/* Genres */}
      <div>
        <h2>Genres</h2>
        {data.title_genres?.map((genre, idx) => (
          <div key={idx}>
            <input
              type="text"
              value={genre.genre_new}
              onChange={(e) => {
                const newGenres = [...(data.title_genres || [])];
                newGenres[idx] = { ...genre, genre_new: e.target.value };
                setData({ ...data, title_genres: newGenres });
              }}
            />
          </div>
        ))}
        <button onClick={() => handleSave("title_genres")} disabled={saving}>
          Save Genres
        </button>
      </div>

      {/* Links */}
      <div>
        <h2>Links</h2>
        {data.title_links?.map((link, idx) => (
          <div key={idx}>
            <input
              type="text"
              value={link.link_type_old}
              onChange={(e) => {
                const newLinks = [...(data.title_links || [])];
                newLinks[idx] = { ...link, link_type_new: e.target.value };
                setData({ ...data, title_links: newLinks });
              }}
            />
            <input
              type="text"
              value={link.link_old}
              onChange={(e) => {
                const newLinks = [...(data.title_links || [])];
                newLinks[idx] = { ...link, link_new: e.target.value };
                setData({ ...data, title_links: newLinks });
              }}
            />
          </div>
        ))}
        <button onClick={() => handleSave("title_links")} disabled={saving}>
          Save Links
        </button>
      </div>

      {/* Networks */}
      <div>
        <h2>Networks</h2>
        {data.title_networks?.map((network, idx) => (
          <div key={idx}>
            <input
              type="text"
              value={network.network_id_old}
              onChange={(e) => {
                const newNetworks = [...(data.title_networks || [])];
                newNetworks[idx] = {
                  ...network,
                  network_id_new: e.target.value,
                };
                setData({ ...data, title_networks: newNetworks });
              }}
            />
          </div>
        ))}
        <button onClick={() => handleSave("title_networks")} disabled={saving}>
          Save Networks
        </button>
      </div>

      {/* Regions */}
      <div>
        <h2>Regions</h2>
        {data.title_regions?.map((region, idx) => (
          <div key={idx}>
            <input
              type="text"
              value={region.production_region_code_old || ""}
              onChange={(e) => {
                const newRegions = [...(data.title_regions || [])];
                newRegions[idx] = {
                  ...region,
                  production_region_code_new: e.target.value,
                };
                setData({ ...data, title_regions: newRegions });
              }}
            />
            <input
              type="text"
              value={region.origin_region_code_old || ""}
              onChange={(e) => {
                const newRegions = [...(data.title_regions || [])];
                newRegions[idx] = {
                  ...region,
                  origin_region_code_new: e.target.value,
                };
                setData({ ...data, title_regions: newRegions });
              }}
            />
          </div>
        ))}
        <button onClick={() => handleSave("title_regions")} disabled={saving}>
          Save Regions
        </button>
      </div>

      {/* Spoken Languages */}
      <div>
        <h2>Spoken Languages</h2>
        {data.title_spoken_languages?.map((lang, idx) => (
          <div key={idx}>
            <input
              type="text"
              value={lang.spoken_language_id_old}
              onChange={(e) => {
                const newSp = [...(data.title_spoken_languages || [])];
                newSp[idx] = {
                  ...lang,
                  spoken_language_id_new: e.target.value,
                };
                setData({ ...data, title_spoken_languages: newSp });
              }}
            />
          </div>
        ))}
        <button
          onClick={() => handleSave("title_spoken_languages")}
          disabled={saving}
        >
          Save Spoken Languages
        </button>
      </div>

      {/* Languages */}
      <div>
        <h2>Languages</h2>
        {data.title_languages?.map((lang, idx) => (
          <div key={idx}>
            <input
              type="text"
              value={lang.language_code_old}
              onChange={(e) => {
                const newLangs = [...(data.title_languages || [])];
                newLangs[idx] = { ...lang, language_code_new: e.target.value };
                setData({ ...data, title_languages: newLangs });
              }}
            />
          </div>
        ))}
        <button onClick={() => handleSave("title_languages")} disabled={saving}>
          Save Languages
        </button>
      </div>

      <hr />
      <button onClick={handleSaveAll} disabled={saving}>Save All Tables</button>
    </div>
  );
}
