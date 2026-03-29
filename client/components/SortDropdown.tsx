"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort_by") || "rating";

  const handleSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort_by", e.target.value);
    params.set("page", "1"); // Reset pagination
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="sort" className="text-sm font-medium text-neutral-400 whitespace-nowrap">
        Sort by:
      </label>
      <select
        id="sort"
        value={currentSort}
        onChange={handleSort}
        className="bg-certifind-bg border border-white/10 text-white text-sm rounded-xl focus:ring-certifind-accent focus:border-certifind-accent block w-full p-2.5 appearance-none cursor-pointer hover:border-white/30 transition-colors py-3 px-4 shadow-sm"
        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `2.5rem` }}
      >
        <option value="rating">Highest Rated</option>
        <option value="newest">Newest First</option>
        <option value="popularity">Most Popular</option>
      </select>
    </div>
  );
}
