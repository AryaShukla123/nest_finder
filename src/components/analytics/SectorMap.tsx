"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import type { Layer, StyleFunction, PathOptions } from "leaflet";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import "leaflet/dist/leaflet.css";

interface SectorStat {
  sector: string;
  avg_price_per_sqft: number;
  avg_price: number;
  listing_count: number;
}

interface SectorProperties {
  name: string;
}

// 5-bucket green -> yellow -> red scale, cheap to expensive
const COLOR_SCALE = ["#2E7D32", "#8BC34A", "#FDD835", "#FB8C00", "#D32F2F"];
const NO_DATA_COLOR = "#D1D5DB";

function buildQuantileBreaks(values: number[], buckets: number): number[] {
  const sorted = [...values].sort((a, b) => a - b);
  const breaks: number[] = [];
  for (let i = 1; i < buckets; i++) {
    const idx = Math.floor((sorted.length * i) / buckets);
    breaks.push(sorted[Math.min(idx, sorted.length - 1)]);
  }
  return breaks;
}

function colorForValue(value: number, breaks: number[]): string {
  for (let i = 0; i < breaks.length; i++) {
    if (value <= breaks[i]) return COLOR_SCALE[i];
  }
  return COLOR_SCALE[COLOR_SCALE.length - 1];
}

const GURUGRAM_CENTER: [number, number] = [28.4595, 77.0266];

export default function SectorMap() {
  const [geoData, setGeoData] = useState<FeatureCollection<Geometry, SectorProperties> | null>(null);
  const [stats, setStats] = useState<SectorStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/data/gurugram_sectors.geojson").then((r) => {
        if (!r.ok) throw new Error("Failed to load sector boundaries");
        return r.json();
      }),
      fetch("/data/sector_stats.json").then((r) => {
        if (!r.ok) throw new Error("Failed to load sector stats");
        return r.json();
      }),
    ])
      .then(([geo, statData]) => {
        setGeoData(geo);
        setStats(statData);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const statsBySector = useMemo(() => {
    const map = new Map<string, SectorStat>();
    stats.forEach((s) => map.set(s.sector, s));
    return map;
  }, [stats]);

  const breaks = useMemo(() => {
    if (stats.length === 0) return [];
    return buildQuantileBreaks(
      stats.map((s) => s.avg_price_per_sqft),
      COLOR_SCALE.length
    );
  }, [stats]);

  const styleFn: StyleFunction<SectorProperties> = (feature) => {
    const props = feature?.properties;
    const stat = props ? statsBySector.get(props.name) : undefined;
    const fillColor = stat ? colorForValue(stat.avg_price_per_sqft, breaks) : NO_DATA_COLOR;
    const style: PathOptions = {
      fillColor,
      fillOpacity: 0.7,
      color: "#374151",
      weight: 1,
      opacity: 0.4,
    };
    return style;
  };

  const onEachFeature = (feature: Feature<Geometry, SectorProperties>, layer: Layer) => {
    const stat = statsBySector.get(feature.properties.name);
    const html = stat
      ? `<div class="text-sm">
          <div class="font-semibold text-ink mb-1">${feature.properties.name}</div>
          <div>Avg price/sqft: <strong>₹${stat.avg_price_per_sqft.toLocaleString("en-IN")}</strong></div>
          <div>Avg price: <strong>₹${stat.avg_price} Cr</strong></div>
          <div>Listings: <strong>${stat.listing_count}</strong></div>
        </div>`
      : `<div class="text-sm"><div class="font-semibold text-ink">${feature.properties.name}</div><div class="text-muted">No listing data</div></div>`;
    layer.bindPopup(html);

    layer.on({
      mouseover: (e) => {
        const target = e.target;
        target.setStyle({ weight: 2.5, opacity: 0.9, fillOpacity: 0.85 });
        target.bringToFront();
      },
      mouseout: (e) => {
        const target = e.target;
        target.setStyle({ weight: 1, opacity: 0.4, fillOpacity: 0.7 });
      },
    });
  };

  if (loading) {
    return (
      <div className="h-[560px] w-full rounded-lg border border-border bg-surface flex items-center justify-center text-muted">
        Loading map…
      </div>
    );
  }

  if (error || !geoData) {
    return (
      <div className="h-[560px] w-full rounded-lg border border-border bg-surface flex items-center justify-center text-muted">
        {error ?? "Could not load map data."}
      </div>
    );
  }

  return (
    <div className="relative">
      <MapContainer
        center={GURUGRAM_CENTER}
        zoom={11}
        scrollWheelZoom
        className="h-[560px] w-full rounded-lg border border-border z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSON data={geoData} style={styleFn} onEachFeature={onEachFeature} />
      </MapContainer>

      <div className="absolute bottom-4 right-4 z-[400] bg-white/95 backdrop-blur rounded-lg border border-border shadow-md px-3 py-2.5 text-xs">
        <div className="font-semibold text-ink mb-1.5">Avg price / sqft</div>
        <div className="flex items-center gap-1">
          {COLOR_SCALE.map((c, i) => (
            <span key={c} className="w-6 h-3 rounded-sm" style={{ backgroundColor: c }} title={String(breaks[i] ?? "")} />
          ))}
        </div>
        <div className="flex justify-between text-muted mt-1">
          <span>Cheaper</span>
          <span>Expensive</span>
        </div>
        <div className="flex items-center gap-1.5 mt-2 pt-1.5 border-t border-border">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: NO_DATA_COLOR }} />
          <span className="text-muted">No data</span>
        </div>
      </div>
    </div>
  );
}
