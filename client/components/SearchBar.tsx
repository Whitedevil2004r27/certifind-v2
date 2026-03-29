"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [term, setTerm] = useState(searchParams.get("search") || "");

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const params = new URLSearchParams(searchParams.toString());
      if (term.trim()) {
        params.set("search", term.trim());
      } else {
        params.delete("search");
      }
      params.set("page", "1"); // reset pagination
      router.push(`?${params.toString()}`);
    },
    [term, router, searchParams]
  );

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <Search className="w-5 h-5 text-neutral-400" />
      </div>
      <input
        type="search"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className="block w-full p-4 pl-12 text-sm text-white bg-certifind-bg border border-white/10 rounded-2xl focus:ring-certifind-accent focus:border-certifind-accent transition-all placeholder-neutral-500"
        placeholder="Search for tracks, tools, or instructors..."
      />
      <button
        type="submit"
        className="text-white absolute right-2.5 bottom-2.5 bg-certifind-accent hover:bg-certifind-accent/80 focus:ring-4 focus:outline-none focus:ring-certifind-accent/50 font-bold rounded-xl text-sm px-4 py-2 transition-all"
      >
        Search
      </button>
    </form>
  );
}
