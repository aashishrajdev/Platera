"use client";

import { useState, useEffect, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChefHat,
  Star,
  Clock,
  Sparkles,
  Filter,
  ListFilter,
  X,
} from "lucide-react";
import { RecipeCard } from "@/components/recipes/RecipeCard";

interface Recipe {
  id: string;
  title: string;
  description?: string;
  category: "VEG" | "NON_VEG" | "EGG";
  servings: number;
  totalTime: number;
  images: string[];
  author: {
    id: string;
    name: string;
    profileImage?: string;
  };
  avgRating: number;
  _count: {
    reviews: number;
    comments: number;
  };
}

function ExploreContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Core State
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [showSortPanel, setShowSortPanel] = useState(false);
  const sortRef = useRef<HTMLDivElement | null>(null);
  const filterRef = useRef<HTMLDivElement | null>(null);
  // Derived State from URL
  const category = searchParams.get("category") || "";
  const maxTime = searchParams.get("maxTime") || "";
  const minRating = searchParams.get("minRating") === "4";
  const sortBy = searchParams.get("sortBy") || "newest";
  const urlSearchQuery = searchParams.get("search") || "";

  // Sync local search with URL
  useEffect(() => {
    setLocalSearchQuery(urlSearchQuery);
  }, [urlSearchQuery]);

  // Fetch when URL params change
  useEffect(() => {
    fetchRecipes();
  }, [category, maxTime, minRating, sortBy, urlSearchQuery]);

  // Close sort/filter panels on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        showSortPanel &&
        sortRef.current &&
        !sortRef.current.contains(target)
      ) {
        setShowSortPanel(false);
      }
      if (
        showFilterPanel &&
        filterRef.current &&
        !filterRef.current.contains(target)
      ) {
        setShowFilterPanel(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [showSortPanel, showFilterPanel]);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (maxTime) params.append("maxTime", maxTime);
      if (minRating) params.append("minRating", "4");
      if (sortBy) params.append("sortBy", sortBy);
      if (urlSearchQuery) params.append("search", urlSearchQuery);

      const response = await fetch(`/api/recipes?${params}`);
      if (response.ok) {
        const data = await response.json();
        setRecipes(data.recipes || []);
      }
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchQuery(value);

    // Debounce URL update
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      router.replace(`/explore?${params.toString()}`);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const clearFilters = () => {
    router.push("/explore");
    setLocalSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 selection:bg-amber-500/30 selection:text-amber-100">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-stone-900 via-stone-950 to-transparent opacity-80" />
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-amber-900/20 rounded-full blur-3xl mix-blend-screen opacity-30" />
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-sepia-900/10 rounded-full blur-3xl mix-blend-screen opacity-20" />
      </div>

      {/* Header Section */}
      <section className="relative z-10 pt-32 pb-24 px-4">
        <div className="container mx-auto max-w-5xl text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900/50 border border-stone-800 backdrop-blur-md"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span className="text-xs font-medium text-amber-500 uppercase tracking-widest">
              Premium Collection
            </span>
          </motion.div>

          {/* Title */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-medium text-white tracking-tight"
            >
              Culinary{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-sepia-100 to-amber-200">
                Excellence
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl text-stone-400 font-light max-w-2xl mx-auto leading-relaxed"
            >
              Explore a curated selection of exquisite recipes crafted by our
              community of passionate chefs.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Header Background Blocker - Prevents content from showing behind header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-stone-950/80 backdrop-blur-xl z-30 border-b border-stone-800/50" />

      {/* Search & Filter Section */}
      <section className="sticky top-16 z-40 bg-stone-950/80 backdrop-blur-xl border-b border-stone-800/50">
        <div className="absolute -bottom-8 left-0 right-0 h-8 bg-gradient-to-b from-stone-950/80 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex items-center justify-between gap-3">
            {/* Search (left) */}
            <div className="group relative inline-flex items-center">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-full blur opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none z-10">
                  <Search className="w-4 h-4 text-stone-400 group-focus-within:text-amber-500 transition-colors duration-300" />
                </div>
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={localSearchQuery}
                  onChange={handleSearch}
                  className="pl-10 pr-4 py-2.5 w-64 sm:w-72 md:w-96 bg-stone-900/40 border border-stone-800 hover:border-stone-700 focus:border-amber-500/50 rounded-full text-sm text-stone-200 placeholder:text-stone-500 focus:outline-none focus:ring-1 focus:ring-amber-500/20 transition-all duration-300 backdrop-blur-md shadow-lg shadow-black/20 group-hover:bg-stone-900/60"
                />
              </div>
            </div>

            {/* Actions (right): Filter + Sort */}
            <div className="flex items-center gap-3">
              {/* Filter: header-style button and popup */}
              <div className="relative" ref={filterRef}>
                <button
                  onClick={() => setShowFilterPanel(!showFilterPanel)}
                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all border ${
                    showFilterPanel
                      ? "bg-amber-600 text-white border-amber-500"
                      : "bg-stone-900/60 text-stone-400 border-stone-800 hover:text-white hover:bg-stone-800"
                  }`}
                  title="Filter Recipes"
                >
                  {showFilterPanel ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Filter className="w-5 h-5" />
                  )}
                </button>

                {/* Filter Popup */}
                <AnimatePresence>
                  {showFilterPanel && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-12 left-0 w-80 p-5 bg-stone-950/95 backdrop-blur-xl border border-stone-800 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50"
                    >
                      <div className="space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                          <span className="font-display font-semibold text-white text-lg">
                            Filters
                          </span>
                          <button
                            onClick={() => {
                              router.push("/explore");
                              setShowFilterPanel(false);
                            }}
                            className="text-xs text-amber-500 hover:text-amber-400 font-medium tracking-wide uppercase"
                          >
                            Reset All
                          </button>
                        </div>

                        {/* Categories */}
                        <div className="space-y-3">
                          <label className="text-xs text-stone-500 font-medium uppercase tracking-wider">
                            Category
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { value: "VEG", label: "Vegetarian" },
                              { value: "NON_VEG", label: "Non-Veg" },
                              { value: "EGG", label: "Contains Egg" },
                            ].map((cat) => {
                              const isActive =
                                searchParams.get("category") === cat.value;
                              return (
                                <button
                                  key={cat.value}
                                  onClick={() => {
                                    const params = new URLSearchParams(
                                      searchParams.toString()
                                    );
                                    if (isActive) params.delete("category");
                                    else params.set("category", cat.value);
                                    router.replace(
                                      `/explore?${params.toString()}`
                                    );
                                  }}
                                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${
                                    isActive
                                      ? "bg-amber-900/30 text-amber-500 border border-amber-800/50"
                                      : "bg-stone-900/50 text-stone-400 border border-stone-800 hover:bg-stone-900 hover:text-stone-200"
                                  }`}
                                >
                                  {cat.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Time */}
                        <div className="space-y-3">
                          <label className="text-xs text-stone-500 font-medium uppercase tracking-wider">
                            Max Time
                          </label>
                          <div className="flex gap-2">
                            {["30", "60"].map((time) => {
                              const isActive =
                                searchParams.get("maxTime") === time;
                              return (
                                <button
                                  key={time}
                                  onClick={() => {
                                    const params = new URLSearchParams(
                                      searchParams.toString()
                                    );
                                    if (isActive) params.delete("maxTime");
                                    else params.set("maxTime", time);
                                    router.replace(
                                      `/explore?${params.toString()}`
                                    );
                                  }}
                                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                                    isActive
                                      ? "bg-stone-100 text-stone-900"
                                      : "bg-stone-900/50 text-stone-400 border border-stone-800 hover:bg-stone-900"
                                  }`}
                                >
                                  &lt; {time} min
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="pt-2">
                          <button
                            onClick={() => {
                              const params = new URLSearchParams(
                                searchParams.toString()
                              );
                              if (params.get("minRating"))
                                params.delete("minRating");
                              else params.set("minRating", "4");
                              router.replace(`/explore?${params.toString()}`);
                            }}
                            className={`w-full px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                              searchParams.get("minRating")
                                ? "bg-amber-600 text-white shadow-lg shadow-amber-900/40"
                                : "bg-stone-900 text-stone-400 border border-stone-800 hover:bg-stone-800"
                            }`}
                          >
                            <Star
                              className={`w-4 h-4 ${
                                searchParams.get("minRating")
                                  ? "fill-white"
                                  : ""
                              }`}
                            />
                            <span className="font-medium">4+ Stars Only</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Sort: button with dropdown content */}
              <div className="relative" ref={sortRef}>
                <button
                  onClick={() => setShowSortPanel((v) => !v)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all border ${
                    showSortPanel
                      ? "bg-stone-100 text-stone-900 border-white"
                      : "bg-stone-900/60 text-stone-400 border-stone-800 hover:text-white hover:bg-stone-800"
                  }`}
                  aria-haspopup="menu"
                  aria-expanded={showSortPanel}
                >
                  <ListFilter className="w-4 h-4" />
                  <span className="text-sm font-medium hidden sm:block">
                    Sort
                  </span>
                </button>

                <AnimatePresence>
                  {showSortPanel && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-12 right-0 w-48 py-2 bg-stone-950/95 backdrop-blur-xl border border-stone-800 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50"
                      role="menu"
                    >
                      <div className="flex flex-col">
                        <span className="px-4 py-2 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                          Sort Order
                        </span>
                        {[
                          { value: "newest", label: "Newest First" },
                          { value: "rating", label: "Highest Rated" },
                          { value: "popular", label: "Most Popular" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              const params = new URLSearchParams(
                                searchParams.toString()
                              );
                              params.set("sortBy", option.value);
                              router.replace(`/explore?${params.toString()}`);
                              setShowSortPanel(false);
                            }}
                            className={`px-4 py-2.5 text-sm text-left hover:bg-stone-900 transition-colors ${
                              (searchParams.get("sortBy") || "newest") ===
                              option.value
                                ? "text-amber-500 font-medium"
                                : "text-stone-300"
                            }`}
                            role="menuitem"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="relative z-10 min-h-[60vh]">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {loading ? (
            <LoadingGrid />
          ) : recipes.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {recipes.map((recipe) => (
                  <motion.div
                    key={recipe.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.4,
                      type: "spring",
                      stiffness: 100,
                    }}
                  >
                    <RecipeCard recipe={recipe} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <EmptyState onClearFilters={clearFilters} />
          )}
        </div>
      </section>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<LoadingGrid />}>
      <ExploreContent />
    </Suspense>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="animate-pulse bg-stone-900/50 rounded-2xl overflow-hidden border border-stone-800 h-[450px]"
        >
          <div className="h-64 bg-stone-800/50" />
          <div className="p-6 space-y-4">
            <div className="h-6 bg-stone-800/50 rounded w-3/4" />
            <div className="h-4 bg-stone-800/50 rounded w-full" />
            <div className="flex justify-between pt-4">
              <div className="h-8 w-24 bg-stone-800/50 rounded-full" />
              <div className="h-8 w-8 bg-stone-800/50 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="text-center py-24 space-y-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-stone-900/50 border border-stone-800 shadow-xl shadow-stone-950/20"
      >
        <ChefHat className="w-10 h-10 text-stone-600" />
      </motion.div>

      <div className="space-y-2">
        <h3 className="text-2xl font-display text-stone-300">
          No recipes found
        </h3>
        <p className="text-stone-500 max-w-md mx-auto font-light">
          We couldn't find any recipes matching your specific criteria. Try
          adjusting your filters.
        </p>
      </div>

      <button
        onClick={onClearFilters}
        className="px-8 py-3 bg-stone-100 hover:bg-white text-stone-900 rounded-full font-medium transition-all shadow-lg shadow-white/5 hover:scale-105"
      >
        Clear Filters
      </button>
    </div>
  );
}
