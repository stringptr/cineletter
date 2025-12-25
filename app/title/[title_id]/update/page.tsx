"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { record, z } from "zod";
import * as update_schemas from "@/schemas/title/update";
import { titleCompleteSchema } from "@/schemas/title/base.ts";
import { Capitalize } from "@/lib/string.ts";
import React from "react";

export default function TitleUpdatePage() {
  const { title_id } = useParams();
  const [data, setData] = useState<
    z.infer<typeof update_schemas.titleCompleteUpdateSchema> | null
  >(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  function emptyFromSchema<T extends z.ZodObject<any>>(schema: T) {
    const shape = schema.shape;
    const result: Record<string, any> = {};

    for (const key in shape) {
      result[key] = null;
    }

    return result as z.infer<T>;
  }

  function Diff(
    data_diff: Record<string, any>,
    titleId: string = data.title.title_id,
  ): Record<string, any> {
    const isAdded = data_diff.will_be_added === true;
    const isDeleted = data_diff.will_be_deleted === true;

    const hasNewValue = Object.keys(data_diff).some((key) =>
      key.endsWith("_new") &&
      data_diff[key] != null &&
      data_diff[key] !== ""
    );

    const hasChangedValue = Object.keys(data_diff).some((key) => {
      if (!key.endsWith("_new")) return false;
      const base = key.slice(0, -4);
      return data_diff[key] !== data_diff[base];
    });

    const keep = isDeleted ||
      (isAdded && hasNewValue) ||
      hasChangedValue;

    if (!keep) return {};

    if (!data_diff.title_id && titleId) {
      return { ...data_diff, title_id: titleId };
    }

    return data_diff;
  }

  function DuplicateColumn(
    data: Record<string, any>,
    deletable: boolean = false,
    exclude: string[] = ["title_id"],
  ) {
    const result: Record<string, any> = {};

    for (const key of Object.keys(data)) {
      result[key] = data[key];
      if (exclude.includes(key)) continue;
      result[`${key}_new`] = data[key];
    }

    if (deletable) {
      result[`will_be_deleted`] = false;
      result[`will_be_added`] = false;
    }

    return result;
  }

  function fetchData(table: string[] = []) {
    setLoading(true);
    fetch(`/api/title/${title_id}/update`, {
      cache: "force-cache",
      next: { tags: [`title_data:${title_id}`] },
    })
      .then((r) => r.json())
      .then((e) => {
        const transformed = Object.fromEntries(
          Object.entries(e).map(([key, value]) => {
            if (Array.isArray(value)) {
              return [key, value.map((i: any) => DuplicateColumn(i, true))];
            }

            if (value !== null && typeof value === "object") {
              return [key, DuplicateColumn(value)];
            }

            return [key, value];
          }),
        );

        setData((prev: any) => {
          // full refresh
          if (!table.length) {
            return transformed;
          }

          // partial refresh
          const next = { ...prev };
          for (const key of table) {
            if (key in transformed) {
              next[key] = transformed[key as keyof typeof transformed];
            }
          }
          return next;
        });
      });

    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, [title_id]);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data found</div>;

  interface ColumnFormProps {
    item?: any;
    idx?: number;
    arrayFieldName?: string;
    oldKey?: string;
    newKey?: string;

    fieldName?: string;
    label?: string;

    data: any;
    setData: React.Dispatch<React.SetStateAction<any>>;
    type?: "text" | "number" | "date" | "textarea";
    disabled?: boolean;
    deletable?: boolean;
  }

  function ColumnForm({
    item,
    idx,
    arrayFieldName,
    oldKey,
    newKey,
    fieldName,
    label,
    data,
    setData,
    type = "text",
    disabled = false,
    deletable = false,
  }: ColumnFormProps) {
    // ===============================
    // LOCAL INPUT STATE (KEY PART)
    // ===============================
    const [localValue, setLocalValue] = useState("");

    // sync FROM parent → local
    useEffect(() => {
      if (arrayFieldName && item) {
        const v = item.will_be_deleted ? item[oldKey!] : item[newKey!];
        setLocalValue(v ?? "");
        return;
      }

      if (fieldName) {
        const v = fieldName
          .split(".")
          .reduce((acc, k) => acc?.[k], data);
        setLocalValue(v ?? "");
      }
    }, [item, fieldName, data, arrayFieldName, oldKey, newKey]);

    // ===============================
    // COMMIT TO PARENT
    // ===============================
    const commitValue = (value: string) => {
      if (arrayFieldName && idx !== undefined) {
        setData((prev: any) => {
          const arr = [...(prev[arrayFieldName] || [])];
          arr[idx] = {
            ...arr[idx],
            [newKey!]: value,
          };
          return { ...prev, [arrayFieldName]: arr };
        });
        return;
      }

      if (fieldName) {
        setData((prev: any) => {
          const keys = fieldName.split(".");
          const next = { ...prev };
          let cur = next;
          for (let i = 0; i < keys.length - 1; i++) {
            cur[keys[i]] = { ...(cur[keys[i]] || {}) };
            cur = cur[keys[i]];
          }
          cur[keys[keys.length - 1]] = value;
          return next;
        });
      }
    };

    const isDisabled = disabled || (item && item.will_be_deleted);

    // ===============================
    // RENDER
    // ===============================
    const Input = type === "textarea" ? "textarea" : "input";

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label className="text-sm font-medium">
            {label}
          </label>
        )}

        <Input
          {...(type !== "textarea" ? { type } : {})}
          value={localValue}
          disabled={isDisabled}
          onChange={(e: any) => setLocalValue(e.target.value)}
          onBlur={() => commitValue(localValue)} // 🔑 commit on blur
          className={`px-3 py-2 border rounded ${
            isDisabled ? "bg-gray-300 text-gray-400" : "bg-white"
          }`}
        />

        {deletable && arrayFieldName && item && (
          <label className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={!!item.will_be_deleted}
              onChange={(e) =>
                setData((prev: any) => {
                  const arr = [...prev[arrayFieldName]];
                  arr[idx!] = {
                    ...arr[idx!],
                    will_be_deleted: e.target.checked,
                  };
                  return { ...prev, [arrayFieldName]: arr };
                })}
            />
            Delete
          </label>
        )}
      </div>
    );
  }

  const handleSave = async (tableKey: keyof typeof data) => {
    if (!data) return;
    setSaving(true);
    try {
      // Prepare payload based on table
      const payload: any = {};
      switch (tableKey) {
        case "title":
          payload.title = Diff(data.title) || {};
          break;
        case "title_akas":
          payload.title_akas = data.title_akas?.map((a) => Diff(a));
          break;
        case "title_genres":
          payload.title_genres = data.title_genres?.map((a) => Diff(a));
          break;
        case "title_links":
          payload.title_links = data.title_links?.map((f) => Diff(f));
          break;
        case "title_networks":
          payload.title_networks = data.title_networks?.map((n) => Diff(n));
          break;
        case "title_regions":
          payload.title_regions = data.title_regions?.map((r) => Diff(r));
          break;
        case "title_spoken_languages":
          payload.title_spoken_languages = data.title_spoken_languages?.map((
            s,
          ) => Diff(s));
          break;
        case "title_languages":
          payload.title_languages = data.title_languages?.map((l) => Diff(l));
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
        fetchData(
          Object.entries(payload)
            .filter(([, v]) => v != null)
            .map(([k]) => k),
        );
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
        title: data.title,
        title_akas: data.title_akas,
        title_genres: data.title_genres,
        title_links: data.title_links,
        title_networks: data.title_networks,
        title_regions: data.title_regions,
        title_spoken_languages: data.title_spoken_languages,
        title_languages: data.title_languages,
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
      {Object.keys(data.title).filter((key) => key.endsWith("_new")).map((
        key,
      ) => (
        <ColumnForm
          key={key}
          fieldName={`title.${key}`}
          label={Capitalize(
            key.trim().replaceAll("-", " ")
              .replaceAll("_", " "),
          )}
          data={data}
          setData={setData}
        />
      ))}

      {/* Title */}
      <div className="flex flex-col">
        <button onClick={() => handleSave("title")} disabled={saving}>
          Save Title
        </button>
      </div>

      {/* AKAs */}
      <div>
        <h2>AKAs</h2>

        <div className="flex flex-row gap-2">
          {data.title_akas?.map((item, idx) => (
            <div key={`aka-${idx}`} className="flex flex-col gap-2">
              {Object.keys(item)
                .filter((key) =>
                  key.endsWith("_new")
                )
                .map((key, idi, arr) => (
                  <ColumnForm
                    key={`aka-${idx}-${key}`}
                    item={item}
                    idx={idx}
                    arrayFieldName="title_akas"
                    oldKey={key.slice(0, -4)}
                    newKey={key}
                    label={Capitalize(
                      key.replace(/[_-]/g, " "),
                    )}
                    data={data}
                    setData={setData}
                    deletable={idi === arr.length - 1}
                  />
                ))}
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            const prevAkas = data.title_akas ?? [];

            const newRow = {
              ...emptyFromSchema(
                update_schemas.titleAkaUpdateSchema,
              ),
              will_be_added: true,
            };

            setData({
              ...data,
              title_akas: [...prevAkas, newRow],
            });
          }}
          disabled={saving}
        >
          Add New
        </button>
        <button onClick={() => handleSave("title_akas")} disabled={saving}>
          Save AKAs
        </button>
      </div>

      {/* Genres */}
      <div>
        <h2>Genres</h2>
        {data.title_genres?.map((item, idx) => (
          <div key={`genre-${idx}`} className="flex flex-col gap-2">
            {Object.keys(item)
              .filter((key) =>
                key.endsWith("_new")
              )
              .map((key, idi, arr) => (
                <ColumnForm
                  key={`genre-${idx}-${key}`}
                  item={item}
                  idx={idx}
                  arrayFieldName="title_genres"
                  oldKey={key.slice(0, -4)}
                  newKey={key}
                  label={Capitalize(
                    key.replace(/[_-]/g, " "),
                  )}
                  data={data}
                  setData={setData}
                  deletable={idi === arr.length - 1}
                />
              ))}
          </div>
        ))}
        <button
          onClick={() => {
            const prevGenres = data.title_genres ?? [];

            const newRow = {
              ...emptyFromSchema(update_schemas.titleGenreUpdateSchema),
              will_be_added: true,
            };

            setData({
              ...data,
              title_genres: [...prevGenres, newRow],
            });
          }}
          disabled={saving}
        >
          Add New
        </button>
        <button onClick={() => handleSave("title_genres")} disabled={saving}>
          Save Genres
        </button>
      </div>

      {/* Links */}
      <div>
        <h2>Links</h2>

        <div className="flex flex-row gap-2">
          {data.title_links?.map((item, idx) => (
            <div key={`genre-${idx}`} className="flex flex-col gap-2">
              {Object.keys(item)
                .filter((key) =>
                  key.endsWith("_new")
                )
                .map((key, idi, arr) => (
                  <ColumnForm
                    key={`links-${idx}-${key}`}
                    item={item}
                    idx={idx}
                    arrayFieldName="title_links"
                    oldKey={key.slice(0, -4)}
                    newKey={key}
                    label={Capitalize(
                      key.replace(/[_-]/g, " "),
                    )}
                    data={data}
                    setData={setData}
                    deletable={idi === arr.length - 1}
                  />
                ))}
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            const prevLinks = data.title_links ?? [];

            const newRow = {
              ...emptyFromSchema(
                update_schemas.titleLinkUpdateSchema,
              ),
              will_be_added: true,
            };

            setData({
              ...data,
              title_links: [...prevLinks, newRow],
            });
          }}
          disabled={saving}
        >
          Add New
        </button>
        <button onClick={() => handleSave("title_links")} disabled={saving}>
          Save Links
        </button>
      </div>

      {/* Networks */}
      <div>
        <h2>Networks</h2>
        {data.title_networks?.map((item, idx) => (
          <div key={`genre-${idx}`} className="flex flex-col gap-2">
            {Object.keys(item)
              .filter((key) =>
                key.endsWith("_new")
              )
              .map((key, idi, arr) => (
                <ColumnForm
                  key={`networks-${idx}-${key}`}
                  item={item}
                  idx={idx}
                  arrayFieldName="title_networks"
                  oldKey={key.slice(0, -4)}
                  newKey={key}
                  label={Capitalize(
                    key.replace(/[_-]/g, " "),
                  )}
                  data={data}
                  setData={setData}
                  deletable={idi === arr.length - 1}
                />
              ))}
          </div>
        ))}
        <button
          onClick={() => {
            const prevNetworks = data.title_networks ?? [];

            const newRow = {
              ...emptyFromSchema(
                update_schemas.titleNetworkUpdateSchema,
              ),
              will_be_added: true,
            };

            setData({
              ...data,
              title_networks: [...prevNetworks, newRow],
            });
          }}
          disabled={saving}
        >
          Add New
        </button>
        <button onClick={() => handleSave("title_networks")} disabled={saving}>
          Save Networks
        </button>
      </div>

      {/* Regions */}
      <div>
        <h2>Regions</h2>
        {data.title_regions?.map((item, idx) => (
          <div key={`genre-${idx}`} className="flex flex-col gap-2">
            {Object.keys(item)
              .filter((key) =>
                key.endsWith("_new")
              )
              .map((key, idi, arr) => (
                <ColumnForm
                  key={`regions-${idx}-${key}`}
                  item={item}
                  idx={idx}
                  arrayFieldName="title_regions"
                  oldKey={key.slice(0, -4)}
                  newKey={key}
                  label={Capitalize(
                    key.replace(/[_-]/g, " "),
                  )}
                  data={data}
                  setData={setData}
                  deletable={idi === arr.length - 1}
                />
              ))}
          </div>
        ))}
        <button
          onClick={() => {
            const prevRegions = data.title_regions ?? [];

            const newRow = {
              ...emptyFromSchema(
                update_schemas.titleRegionUpdateSchema,
              ),
              will_be_added: true,
            };

            setData({
              ...data,
              title_regions: [...prevRegions, newRow],
            });
          }}
          disabled={saving}
        >
          Add New
        </button>
        <button onClick={() => handleSave("title_regions")} disabled={saving}>
          Save Regions
        </button>
      </div>

      {/* Spoken Languages */}
      <div>
        <h2>Spoken Languages</h2>
        {data.title_spoken_languages?.map((item, idx) => (
          <div key={`genre-${idx}`} className="flex flex-col gap-2">
            {Object.keys(item)
              .filter((key) =>
                key.endsWith("_new")
              )
              .map((key, idi, arr) => (
                <ColumnForm
                  key={`spoken_languages-${idx}-${key}`}
                  item={item}
                  idx={idx}
                  arrayFieldName="title_spoken_languages"
                  oldKey={key.slice(0, -4)}
                  newKey={key}
                  label={Capitalize(
                    key.replace(/[_-]/g, " "),
                  )}
                  data={data}
                  setData={setData}
                  deletable={idi === arr.length - 1}
                />
              ))}
          </div>
        ))}
        <button
          onClick={() => {
            const prevSpLangs = data.title_spoken_languages ?? [];

            const newRow = {
              ...emptyFromSchema(
                update_schemas.titleSpokenLanguageUpdateSchema,
              ),
              will_be_added: true,
            };

            setData({
              ...data,
              title_spoken_languages: [...prevSpLangs, newRow],
            });
          }}
          disabled={saving}
        >
          Add New
        </button>
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
        {data.title_languages?.map((item, idx) => (
          <div key={`genre-${idx}`} className="flex flex-col gap-2">
            {Object.keys(item)
              .filter((key) =>
                key.endsWith("_new")
              )
              .map((key, idi, arr) => (
                <ColumnForm
                  key={`languages-${idx}-${key}`}
                  item={item}
                  idx={idx}
                  arrayFieldName="title_languages"
                  oldKey={key.slice(0, -4)}
                  newKey={key}
                  label={Capitalize(
                    key.replace(/[_-]/g, " "),
                  )}
                  data={data}
                  setData={setData}
                  deletable={idi === arr.length - 1}
                />
              ))}
          </div>
        ))}
        <button
          onClick={() => {
            const prevLangs = data.title_languages ?? [];

            const newRow = {
              ...emptyFromSchema(update_schemas.titleLanguageUpdateSchema),
              will_be_added: true,
            };

            setData({
              ...data,
              title_languages: [...prevLangs, newRow],
            });
          }}
          disabled={saving}
        >
          Add New
        </button>
        <button onClick={() => handleSave("title_languages")} disabled={saving}>
          Save Languages
        </button>
      </div>

      <hr />
      <button onClick={handleSaveAll} disabled={saving}>Save All Tables</button>
    </div>
  );
}
