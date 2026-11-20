"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Pizza, Search, X } from "lucide-react";
import { apiGet } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FilterSelect from "./FilterSelect";
import MenuItemCard from "./MenuItemCard";
import CardSkeleton from "./CardSkeleton";
import Pagination from "./Pagination";

const PAGE_SIZE = 9;

const SORT_OPTIONS = [
  { value: "", label: "Newest first" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
];

export default function MenuBrowser() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();

  const category = searchParams.get("category") || "";
  const location = searchParams.get("location") || "";
  const sort = searchParams.get("sort") || "";
  const page = Math.max(parseInt(searchParams.get("page")) || 1, 1);

  const [searchText, setSearchText] = useState(searchParams.get("q") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  const [options, setOptions] = useState({ categories: [], locations: [] });
  const [data, setData] = useState({ items: [], total: 0, totalPages: 0 });
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [attempt, setAttempt] = useState(0);

  const updateParams = useCallback(
    (changes) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(changes).forEach(([key, value]) => {
        if (value === "" || value == null) params.delete(key);
        else params.set(key, value);
      });
      if (!("page" in changes)) params.delete("page");

      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [searchParams, router, pathname]
  );


  useEffect(() => {
    apiGet("/api/menu-items/filters")
      .then(setOptions)
      .catch(() => {});
  }, []);


  useEffect(() => {
    const timer = setTimeout(() => {
      const current = {
        q: searchParams.get("q") || "",
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
      };
      const next = {
        q: searchText.trim(),
        minPrice: minPrice.trim(),
        maxPrice: maxPrice.trim(),
      };

      const changes = {};
      Object.keys(next).forEach((key) => {
        if (next[key] !== current[key]) changes[key] = next[key];
      });

      if (Object.keys(changes).length > 0) updateParams(changes);
    }, 450);

    return () => clearTimeout(timer);
  }, [searchText, minPrice, maxPrice, searchParams, updateParams]);


  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");

    const params = new URLSearchParams(queryString);
    params.set("limit", String(PAGE_SIZE));

    apiGet(`/api/menu-items?${params.toString()}`, { signal: controller.signal })
      .then((result) => {
        setData(result);
        setStatus("success");
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setErrorMessage(error.message);
        setStatus("error");
      });

    return () => controller.abort();
  }, [queryString, attempt]);

  const hasFilters = Boolean(
    searchParams.get("q") ||
      category ||
      location ||
      sort ||
      searchParams.get("minPrice") ||
      searchParams.get("maxPrice")
  );

  const clearFilters = () => {
    setSearchText("");
    setMinPrice("");
    setMaxPrice("");
    router.replace(pathname, { scroll: false });
  };

  const handlePageChange = (newPage) => {
    updateParams({ page: newPage === 1 ? "" : String(newPage) });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, data.total);

  return (
    <div>

      <div className="mb-8 rounded-2xl border bg-card p-4 shadow-sm sm:p-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search pizza by name..."
            className="pl-9"
            aria-label="Search menu items"
          />
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <FilterSelect
            label="Category"
            value={category}
            onChange={(value) => updateParams({ category: value })}
            allLabel="All Categories"
            options={options.categories.map((c) => ({ value: c, label: c }))}
          />
          <FilterSelect
            label="Location"
            value={location}
            onChange={(value) => updateParams({ location: value })}
            allLabel="All Locations"
            options={options.locations.map((l) => ({ value: l, label: l }))}
          />
          <FilterSelect
            label="Sort by"
            value={sort}
            onChange={(value) => updateParams({ sort: value })}
            options={SORT_OPTIONS}
          />
          <div className="space-y-1.5">
            <Label htmlFor="minPrice" className="text-xs text-muted-foreground">
              Min price ($)
            </Label>
            <Input
              id="minPrice"
              type="number"
              min="0"
              placeholder="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">
              Max price ($)
            </Label>
            <Input
              id="maxPrice"
              type="number"
              min="0"
              placeholder="Any"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
        </div>

        {hasFilters && (
          <div className="mt-3 flex justify-end">
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4" /> Clear filters
            </Button>
          </div>
        )}
      </div>


      {status === "loading" && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}


      {status === "error" && (
        <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border bg-card p-8 text-center">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <p className="font-semibold">Could not load menu items</p>
          <p className="text-sm text-muted-foreground">
            {errorMessage || "Please check your connection and try again."}
          </p>
          <div className="flex gap-2">
            <Button onClick={() => setAttempt((prev) => prev + 1)}>Try Again</Button>
            {hasFilters && (
              <Button variant="outline" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        </div>
      )}

      {status === "success" && data.items.length === 0 && (
        <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border bg-card p-8 text-center">
          <Pizza className="h-10 w-10 text-primary" />
          <p className="font-semibold">
            {hasFilters ? "No items match your filters" : "No menu items yet"}
          </p>
          <p className="text-sm text-muted-foreground">
            {hasFilters
              ? "Try a different search or clear the filters."
              : "Our vendors are preparing their menus. Please check back soon."}
          </p>
          {hasFilters && <Button onClick={clearFilters}>Clear filters</Button>}
        </div>
      )}


      {status === "success" && data.items.length > 0 && (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            Showing {from}-{to} of {data.total} items
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((item) => (
              <MenuItemCard key={item._id} item={item} />
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}