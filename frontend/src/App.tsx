import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import type { FeatureCollection, Feature } from 'geojson';
import type { Layer, PathOptions } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

const API_BASE = import.meta.env.VITE_API_BASE ?? '';

interface PriceRow {
  postalCode: string;
  name: string | null;
  municipality: string | null;
  pricePerSqm: number | null;
  prevPricePerSqm: number | null;
  changePercent: number | null;
}

interface BuildingType {
  code: string;
  description: string;
  description_fi: string;
}

interface Municipality {
  name: string;
  postalCodeCount: number;
}

function FitBounds({ geojson }: { geojson: FeatureCollection }) {
  const map = useMap();
  useEffect(() => {
    if (geojson.features.length === 0) return;
    const layer = L.geoJSON(geojson);
    const bounds = layer.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [geojson, map]);
  return null;
}

function getColor(changePercent: number | null): string {
  if (changePercent === null) return '#cccccc';
  // Clamp to ±20% for color scale
  const clamped = Math.max(-20, Math.min(20, changePercent));
  if (clamped >= 0) {
    // Red scale: 0% → light, 20% → deep red
    const intensity = Math.round(255 - (clamped / 20) * 155);
    return `rgb(255, ${intensity}, ${intensity})`;
  } else {
    // Blue scale: 0% → light, -20% → deep blue
    const intensity = Math.round(255 - (Math.abs(clamped) / 20) * 155);
    return `rgb(${intensity}, ${intensity}, 255)`;
  }
}

export default function App() {
  const [years, setYears] = useState<number[]>([]);
  const [buildingTypes, setBuildingTypes] = useState<BuildingType[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedMunicipality, setSelectedMunicipality] = useState('Helsinki');
  const [geojson, setGeojson] = useState<FeatureCollection | null>(null);
  const [prices, setPrices] = useState<Map<string, PriceRow>>(new Map());
  const [loading, setLoading] = useState(true);

  // Load years, building types, municipalities, geometries on mount
  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/years`).then(r => r.json()),
      fetch(`${API_BASE}/api/building-types`).then(r => r.json()),
      fetch(`${API_BASE}/api/municipalities`).then(r => r.json()),
      fetch(`${API_BASE}/api/geometries`).then(r => r.json()),
    ]).then(([yrs, types, munis, geo]) => {
      setYears(yrs);
      setBuildingTypes(types);
      setMunicipalities(munis);
      setGeojson(geo);
      if (yrs.length > 0) setSelectedYear(yrs[yrs.length - 1]);
      setLoading(false);
    });
  }, []);

  // Load prices when year, building type, or municipality changes
  const [pricesKey, setPricesKey] = useState(0);
  useEffect(() => {
    if (selectedYear === null) return;
    const params = new URLSearchParams({
      year: String(selectedYear),
      building_type: selectedType,
      municipality: selectedMunicipality,
    });
    fetch(`${API_BASE}/api/prices?${params}`)
      .then(r => r.json())
      .then((rows: PriceRow[]) => {
        const map = new Map<string, PriceRow>();
        rows.forEach(r => map.set(r.postalCode, r));
        setPrices(map);
        setPricesKey(k => k + 1);
      });
  }, [selectedYear, selectedType, selectedMunicipality]);

  const style = (feature: Feature | undefined): PathOptions => {
    const code = feature?.properties?.postalCode;
    const row = code ? prices.get(code) : undefined;
    return {
      fillColor: getColor(row?.changePercent ?? null),
      weight: 1,
      opacity: 0.7,
      color: '#555',
      fillOpacity: 0.75,
    };
  };

  const onEachFeature = (feature: Feature, layer: Layer) => {
    const code = feature.properties?.postalCode;
    const row = code ? prices.get(code) : undefined;
    const name = feature.properties?.name ?? '';
    const price = row?.pricePerSqm ? `${row.pricePerSqm.toLocaleString('fi-FI')} €/m²` : 'ei dataa';
    const change = row?.changePercent !== null && row?.changePercent !== undefined
      ? `${row.changePercent > 0 ? '+' : ''}${row.changePercent}%`
      : '';
    layer.bindTooltip(`<b>${code} ${name}</b><br/>${price} ${change}`, { sticky: true });
  };

  if (loading) return <div className="loading">Ladataan...</div>;

  return (
    <div className="app">
      <div className="controls">
        <h1>Asuntojen neliöhinnat</h1>
        <div className="selectors">
          <label>
            Kunta
            <select value={selectedMunicipality} onChange={e => setSelectedMunicipality(e.target.value)}>
              {municipalities.map(m => (
                <option key={m.name} value={m.name}>{m.name}</option>
              ))}
            </select>
          </label>
          <label>
            Vuosi
            <select value={selectedYear ?? ''} onChange={e => setSelectedYear(Number(e.target.value))}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </label>
          <label>
            Talotyyppi
            <select value={selectedType} onChange={e => setSelectedType(e.target.value)}>
              {buildingTypes.map(bt => (
                <option key={bt.code} value={bt.code}>{bt.description_fi}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="legend">
          <span className="legend-label">Lasku</span>
          <div className="legend-bar" />
          <span className="legend-label">Nousu</span>
        </div>
      </div>

      <MapContainer center={[61.5, 25.0]} zoom={6} className="map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geojson && prices.size > 0 && (() => {
          const filteredData: FeatureCollection = {
            type: 'FeatureCollection',
            features: geojson.features.filter(f =>
              prices.has(f.properties?.postalCode)
            ),
          };
          return (
            <>
              <FitBounds geojson={filteredData} />
              <GeoJSON
                key={`${selectedYear}-${selectedType}-${selectedMunicipality}-${pricesKey}`}
                data={filteredData}
                style={style}
                onEachFeature={onEachFeature}
              />
            </>
          );
        })()}
      </MapContainer>
    </div>
  );
}
