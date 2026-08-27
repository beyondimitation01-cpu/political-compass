import { figures, type Figure } from "./figures";

export type NewsItem = {
  id: string;
  date: string;
  category: "Archive update" | "Editorial note" | "Anniversary" | "Research";
  headline: string;
  body: string;
  slug?: string;
};

/** Editorial activity log for the archive. Static, factual, neutral. */
export const news: NewsItem[] = [
  {
    id: "n1",
    date: "12 Aug 2026",
    category: "Archive update",
    headline: "Timeline entries expanded for post-war European leaders",
    body: "Additional dated events were added to profiles covering reconstruction, European integration and the end of the Cold War.",
    slug: figures[0]?.slug,
  },
  {
    id: "n2",
    date: "04 Aug 2026",
    category: "Editorial note",
    headline: "Office classifications standardised across all profiles",
    body: "Every figure is now tagged with normalised office roles — president, prime minister, chancellor, or party leader — so filtering behaves consistently.",
  },
  {
    id: "n3",
    date: "27 Jul 2026",
    category: "Research",
    headline: "Source review completed for independence-era biographies",
    body: "Summaries were checked against published records and reworded where language risked implying editorial judgement.",
  },
  {
    id: "n4",
    date: "19 Jul 2026",
    category: "Anniversary",
    headline: "Milestone anniversaries flagged in figure timelines",
    body: "Key constitutional moments and elections are highlighted in the vertical timelines on each profile page.",
  },
];

/** Deterministic ordering stand-ins until an editorial CMS is connected. */
export const recentlyUpdated: Figure[] = [...figures].slice(-4).reverse();

export const popularFigures: Figure[] = [...figures]
  .filter((f) => f.era === "Contemporary" || f.era === "20th Century")
  .slice(0, 6);

export type CountryGroup = {
  region: Figure["region"];
  countries: { country: string; countryCode: string; count: number }[];
};

export const countriesByRegion: CountryGroup[] = (() => {
  const map = new Map<Figure["region"], Map<string, { code: string; count: number }>>();
  for (const f of figures) {
    if (!map.has(f.region)) map.set(f.region, new Map());
    const inner = map.get(f.region)!;
    const existing = inner.get(f.country);
    if (existing) existing.count += 1;
    else inner.set(f.country, { code: f.countryCode, count: 1 });
  }
  return [...map.entries()]
    .map(([region, inner]) => ({
      region,
      countries: [...inner.entries()]
        .map(([country, v]) => ({ country, countryCode: v.code, count: v.count }))
        .sort((a, b) => a.country.localeCompare(b.country)),
    }))
    .sort((a, b) => a.region.localeCompare(b.region));
})();
