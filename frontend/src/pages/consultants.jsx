import React, { useEffect, useMemo, useState } from "react";
import ConsultantCard from "../components/consultants/consultant-card";
import ConsultantFilter from "../components/consultants/consultant-filter";
import ConsultantSearch from "../components/consultants/consultant-search";
import ActiveFilters from "../components/consultants/active-filters";
import SortSelect from "../components/consultants/sort-select";
import SpecialtyChips from "../components/consultants/specialty-chips";
import EmptyState from "../components/consultants/empty-state";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { Button } from "../components/ui/button";
import { Filter } from "lucide-react";
import BookIntro from "../components/consultants/book-intro";

const SPECIALTIES = ["Anxiety", "Stress", "Depression", "CBT", "Mindfulness", "Relationships", "Sleep", "ADHD"];

const CONSULTANTS = [
  {
    id: 1,
    name: "Dr. Asha Singh",
    tags: ["Anxiety", "CBT"],
    languages: ["English", "Hindi"],
    rating: 4.9,
    price: 1500,
    mode: "online",
    location: "Delhi",
    verified: true,
    available: true,
  },
  {
    id: 2,
    name: "Rahul Mehta",
    tags: ["Stress", "Mindfulness", "Sleep"],
    languages: ["English"],
    rating: 4.7,
    price: 1200,
    mode: "hybrid",
    location: "Mumbai",
    verified: true,
    available: false,
  },
  {
    id: 3,
    name: "Priya Nair",
    tags: ["Depression", "Relationships"],
    languages: ["English", "Malayalam"],
    rating: 4.8,
    price: 1800,
    mode: "in-person",
    location: "Bengaluru",
    verified: true,
    available: true,
  },
  {
    id: 4,
    name: "Arun Sharma",
    tags: ["Anxiety", "Sleep"],
    languages: ["Hindi"],
    rating: 4.6,
    price: 900,
    mode: "online",
    location: "Jaipur",
    verified: false,
    available: true,
  },
  {
    id: 5,
    name: "Meera Joshi",
    tags: ["Mindfulness", "Stress", "Relationships"],
    languages: ["English", "Marathi"],
    rating: 4.5,
    price: 1000,
    mode: "hybrid",
    location: "Pune",
    verified: true,
    available: false,
  },
  {
    id: 6,
    name: "Karan Verma",
    tags: ["ADHD", "CBT"],
    languages: ["English", "Hindi"],
    rating: 4.4,
    price: 800,
    mode: "online",
    location: "Lucknow",
    verified: false,
    available: true,
  },
  {
    id: 7,
    name: "Dr. Nidhi Rao",
    tags: ["Depression", "CBT", "Sleep"],
    languages: ["English", "Kannada"],
    rating: 4.9,
    price: 2200,
    mode: "in-person",
    location: "Bengaluru",
    verified: true,
    available: true,
  },
  {
    id: 8,
    name: "Sana Ali",
    tags: ["Anxiety", "Relationships"],
    languages: ["English", "Urdu"],
    rating: 4.3,
    price: 700,
    mode: "online",
    location: "Hyderabad",
    verified: false,
    available: false,
  },
];

const DEFAULT_FILTERS = {
  specialty: "Any",
  language: "Any",
  available: false,
  mode: "any", // online | in-person | hybrid | any
  minRating: 0,
  maxPrice: 5000,
};

export default function Consultants() {
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState("rating-desc"); // rating-desc | price-asc | price-desc | name
  const [favorites, setFavorites] = useState(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem("sathi-favs") || "[]"));
    } catch {
      return new Set();
    }
  });
  const [visible, setVisible] = useState(6);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Book Intro sheet state
  const [bookFor, setBookFor] = useState(null);

  useEffect(() => {
    localStorage.setItem("sathi-favs", JSON.stringify([...favorites]));
  }, [favorites]);

  const onToggleFav = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    let list = [...CONSULTANTS];

    // text query
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q)) ||
          c.languages.some((l) => l.toLowerCase().includes(q)) ||
          c.location.toLowerCase().includes(q)
      );
    }

    // specialty
    if (filters.specialty !== "Any") {
      list = list.filter((c) => c.tags.includes(filters.specialty));
    }

    // language
    if (filters.language !== "Any") {
      list = list.filter((c) => c.languages.includes(filters.language));
    }

    // available
    if (filters.available) {
      list = list.filter((c) => c.available);
    }

    // mode
    if (filters.mode !== "any") {
      list = list.filter((c) => {
        if (filters.mode === "hybrid") return c.mode === "hybrid";
        if (filters.mode === "online") return c.mode === "online" || c.mode === "hybrid";
        if (filters.mode === "in-person") return c.mode === "in-person" || c.mode === "hybrid";
        return true;
      });
    }

    // rating + price
    list = list.filter((c) => c.rating >= filters.minRating && c.price <= filters.maxPrice);

    // sort
    list.sort((a, b) => {
      if (sortBy === "rating-desc") return b.rating - a.rating;
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

    return list;
  }, [query, filters, sortBy]);

  const visibleList = filtered.slice(0, visible);

  const clearAll = () => setFilters(DEFAULT_FILTERS);
  const removeFilter = (key) => setFilters((f) => ({ ...f, [key]: DEFAULT_FILTERS[key] }));

  return (
    <div className="space-y-6">
      {/* Top controls */}
      <div className="flex items-center gap-3">
        <ConsultantSearch value={query} onChange={setQuery} />
        <SortSelect value={sortBy} onChange={setSortBy} />
        {/* Mobile Filters Drawer */}
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="md:hidden">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80" title="Filters">
            <div className="mt-4">
              <ConsultantFilter
                filters={filters}
                setFilters={setFilters}
                onClear={clearAll}
                compact
              />
              <Button className="mt-4 w-full" onClick={() => setDrawerOpen(false)}>
                Apply
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Quick specialties */}
      <SpecialtyChips
        items={SPECIALTIES}
        active={filters.specialty}
        onPick={(val) => setFilters((f) => ({ ...f, specialty: val }))}
      />

      {/* Active filters summary */}
      <ActiveFilters filters={filters} onRemove={removeFilter} onClear={clearAll} />

      <div className="grid lg:grid-cols-[300px,1fr] gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <ConsultantFilter filters={filters} setFilters={setFilters} onClear={clearAll} />
        </aside>

        {/* Results */}
        <section className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Showing {visibleList.length} of {filtered.length} consultants
          </div>

          {filtered.length === 0 ? (
            <EmptyState onReset={clearAll} />
          ) : (
            <>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-fr">
                {visibleList.map((c) => (
                  <ConsultantCard
                    key={c.id}
                    {...c}
                    favorite={favorites.has(c.id)}
                    onToggleFavorite={() => onToggleFav(c.id)}
                    onBook={() => setBookFor(c)}
                  />
                ))}
              </div>

              {visible < filtered.length && (
                <div className="flex justify-center">
                  <Button variant="secondary" onClick={() => setVisible((v) => v + 6)}>
                    Load more
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {/* Book intro sheet */}
      <BookIntro
        open={!!bookFor}
        consultant={bookFor}
        onClose={() => setBookFor(null)}
        onBooked={(b) => {
          // e.g., toast/confirm
          console.log("Booked intro:", b);
        }}
      />
    </div>
  );
}