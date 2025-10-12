"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SearchIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group.tsx";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (!query.trim()) return;
    router.push(`/search/${encodeURIComponent(query.trim())}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <InputGroup className="w-[50vw] mx-auto mb-8 text-white">
      <InputGroupInput
        placeholder="Search..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <InputGroupAddon>
        <SearchIcon className="text-gray-400" />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <InputGroupButton onClick={handleSearch}>Search</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
}
