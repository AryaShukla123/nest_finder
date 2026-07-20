export interface PredictionListing {
  sector: string;
  property_type: string;
  society: string | null;
  bedRoom: number;
  bathroom: number;
  balcony: number;
  floorNum: number;
  agePossession: string;
  built_up_area: number;
  furnishing_type: number;
  luxury_score: number;
  study_room: number;
  servant_room: number;
  store_room: number;
  pooja_room: number;
  price: number;
  price_per_sqft: number;
}

export interface PredictionInput {
  sector: string;
  property_type: string;
  bedRoom: number;
  bathroom: number;
  balcony: number;
  floorNum: number;
  agePossession: string;
  built_up_area: number;
  furnishing_type: number;
  luxury_score: number;
  study_room: number;
  servant_room: number;
  store_room: number;
  pooja_room: number;
}

export interface PredictionResult {
  low: number;
  median: number;
  high: number;
  lowPsf: number;
  medianPsf: number;
  highPsf: number;
  compCount: number;
  sectorMedianPsf: number | null;
  topComps: (PredictionListing & { score: number })[];
}

const TOP_N = 15;

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

function scoreListing(row: PredictionListing, input: PredictionInput): number {
  let score = 0;

  score += row.sector === input.sector ? 40 : 0;
  score += Math.max(0, 20 - Math.abs(row.bedRoom - input.bedRoom) * 8);
  score += row.property_type === input.property_type ? 10 : 0;
  score += row.furnishing_type === input.furnishing_type ? 8 : 0;
  score += row.agePossession === input.agePossession ? 6 : 0;
  score += Math.max(0, 4 - Math.abs(row.balcony - input.balcony));

  const amenityKeys: (keyof PredictionListing)[] = ["study_room", "servant_room", "store_room", "pooja_room"];
  const amenitiesMatch = amenityKeys.filter((k) => row[k] === input[k as keyof PredictionInput]).length;
  score += amenitiesMatch * 2;

  const areaDiffRatio = Math.abs(row.built_up_area - input.built_up_area) / Math.max(input.built_up_area, 1);
  score += Math.max(0, 15 - 15 * areaDiffRatio);

  const luxDiffRatio = Math.abs(row.luxury_score - input.luxury_score) / 100;
  score += Math.max(0, 10 - 10 * luxDiffRatio);

  const floorDiff = Math.abs(row.floorNum - input.floorNum);
  score += Math.max(0, 5 - floorDiff / 3);

  return score;
}

export function estimatePriceRange(input: PredictionInput, dataset: PredictionListing[]): PredictionResult {
  const scored = dataset.map((row) => ({ ...row, score: scoreListing(row, input) }));
  scored.sort((a, b) => b.score - a.score);
  const topComps = scored.slice(0, TOP_N);

  const psfValues = [...topComps.map((c) => c.price_per_sqft)].sort((a, b) => a - b);
  const lowPsf = percentile(psfValues, 0.2);
  const medianPsf = percentile(psfValues, 0.5);
  const highPsf = percentile(psfValues, 0.8);

  const low = (lowPsf * input.built_up_area) / 1e7;
  const median = (medianPsf * input.built_up_area) / 1e7;
  const high = (highPsf * input.built_up_area) / 1e7;

  const sectorListings = dataset.filter((d) => d.sector === input.sector);
  const sectorMedianPsf =
    sectorListings.length > 0
      ? percentile(
          [...sectorListings.map((d) => d.price_per_sqft)].sort((a, b) => a - b),
          0.5
        )
      : null;

  return { low, median, high, lowPsf, medianPsf, highPsf, compCount: topComps.length, sectorMedianPsf, topComps };
}
