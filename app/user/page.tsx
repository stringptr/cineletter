"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type UserDetail = {
  user_id: number;
  username: string;
  name: string | null;
  email: string;
  gender: string | null;
  description: string | null;
  created_at: string;
};

export default function UserProfilePage() {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(true);

  // form state
  const [name, setName] = useState("");
  const [gender, setGender] = useState<string | null>(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetch("/api/user/detail")
      .then(async (r) => {
        const text = await r.text();
        if (!r.ok) {
          throw new Error(`HTTP error! status: ${r.status}`);
        }
        if (!text) {
          throw new Error("Empty response from server");
        }
        return JSON.parse(text); // Parse manually
      })
      .then((json) => {
        if (json) {
          setUser(json);
          setName(json.name ?? "");
          setGender(json.gender);
          setDescription(json.description ?? "");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  async function save() {
    const res = await fetch("/api/user/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, gender, description }),
    });

    const json = await res.json();
    if (json.success) {
      setUser(json.data);
      setEdit(false);
    }
  }

  if (loading) return <p className="text-white">Loading…</p>;
  if (!user) return <p className="text-red-400">Not logged in</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 text-white">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">@{user.username}</h1>
        <button
          onClick={() => setEdit((v) => !v)}
          className="px-4 py-1 rounded-md bg-[#ffffff1a] hover:bg-[#ffffff2a]"
        >
          {edit ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* VIEW MODE */}
      {!edit && (
        <div className="space-y-3">
          <p>
            <span className="opacity-60">Name:</span> {user.name ?? "—"}
          </p>
          <p>
            <span className="opacity-60">Email:</span> {user.email}
          </p>
          <p>
            <span className="opacity-60">Gender:</span> {user.gender ?? "—"}
          </p>
          <p className="opacity-80">{user.description ?? "No description"}</p>
          <p className="text-xs opacity-40">
            Joined {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* EDIT MODE */}
      {edit && (
        <div className="space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full p-2 rounded bg-[#ffffff0f]"
          />

          <select
            value={gender ?? ""}
            onChange={(e) => setGender(e.target.value || null)}
            className="w-full p-2 rounded bg-[#ffffff0f]"
          >
            <option value="">Prefer not to say</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="About you"
            rows={4}
            className="w-full p-2 rounded bg-[#ffffff0f]"
          />

          <button
            onClick={save}
            className="px-4 py-2 rounded bg-[#ff1212] hover:bg-[#ff3a3a]"
          >
            Save changes
          </button>
        </div>
      )}
    </div>
  );
}
