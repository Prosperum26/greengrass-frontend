import React, { useEffect, useMemo, useState } from 'react';
import { mapApi } from '../../../api';
import GreenMap from './GreenMap';

const WALKING_SPEED_KMH = 4.8;
const BIKING_SPEED_KMH = 15;

const toRadians = (value) => (value * Math.PI) / 180;

const getDistanceKm = (fromLat, fromLng, toLat, toLng) => {
  const earthRadius = 6371;
  const dLat = toRadians(toLat - fromLat);
  const dLng = toRadians(toLng - fromLng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(fromLat)) *
      Math.cos(toRadians(toLat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return earthRadius * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const toMinutes = (distanceKm, speedKmh) =>
  Math.max(1, Math.round((distanceKm / speedKmh) * 60));

const formatDistance = (value) => {
  if (!Number.isFinite(value)) return '-';
  if (value < 1) return `${Math.round(value * 1000)} m`;
  return `${value.toFixed(1)} km`;
};

export const MapExplorerPage = () => {
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [enabledLayers, setEnabledLayers] = useState({
    events: true,
    recycling: false,
    ecoStations: false,
  });
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [nearbyMarkers, setNearbyMarkers] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await mapApi.getMarkers();
        const points = Array.isArray(data) ? data : data?.data || [];
        const normalized = points
          .map((point) => ({
            ...point,
            latitude: point.latitude ?? point.lat,
            longitude: point.longitude ?? point.lng,
            category: point.category || 'Event',
          }))
          .filter(
            (point) =>
              Number.isFinite(point.latitude) && Number.isFinite(point.longitude),
          );
        setMarkers(normalized);
        if (normalized[0]) setSelected(normalized[0]);
      } catch {
        setMarkers([]);
      }
    };
    void load();
  }, []);

  useEffect(() => {
    // Check geolocation support - set error if not available
    if (!navigator.geolocation) {
      setLocationError('Trình duyệt không hỗ trợ định vị.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationError('');
      },
      () => {
        setLocationError('Chưa bật quyền vị trí, thời gian di chuyển đang ước tính.');
      },
      { enableHighAccuracy: true, timeout: 5000 },
    );
  }, []);

  useEffect(() => {
    if (!userLocation) return;
    const loadNearby = async () => {
      try {
        const { data } = await mapApi.getNearby({
          lat: userLocation.latitude,
          lng: userLocation.longitude,
          radius: 8,
        });
        const points = Array.isArray(data) ? data : data?.data || [];
        const normalized = points.map((point) => ({
          ...point,
          latitude: point.latitude ?? point.lat,
          longitude: point.longitude ?? point.lng,
          category: point.category || 'Event',
        }));
        setNearbyMarkers(normalized);
      } catch {
        setNearbyMarkers([]);
      }
    };
    void loadNearby();
  }, [userLocation]);

  const visibleMarkers = useMemo(() => {
    if (!enabledLayers.events) return [];
    return markers;
  }, [markers, enabledLayers.events]);

  const selectedId = selected?.id;
  const center = useMemo(() => {
    if (selected) return [selected.latitude, selected.longitude];
    return undefined;
  }, [selected]);

  const routeStats = useMemo(() => {
    if (!userLocation || !selected?.latitude || !selected?.longitude) {
      return null;
    }
    const distanceKm = getDistanceKm(
      userLocation.latitude,
      userLocation.longitude,
      selected.latitude,
      selected.longitude,
    );
    return {
      distanceKm,
      walkingMinutes: toMinutes(distanceKm, WALKING_SPEED_KMH),
      bikingMinutes: toMinutes(distanceKm, BIKING_SPEED_KMH),
    };
  }, [userLocation, selected]);

  const toggleLayer = (layerKey) => {
    setEnabledLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  return (
    <div className="relative isolate h-[72vh] min-h-[520px] w-full overflow-hidden rounded-2xl bg-surface-high shadow-[0_20px_60px_rgba(33,26,20,0.08)]">
      <div className="absolute inset-0 z-0">
        <GreenMap
          center={center}
          markers={visibleMarkers}
          selectedId={selectedId}
          onSelect={(p) => setSelected(p)}
        />
      </div>

      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-full md:w-[340px] p-4 md:p-5 flex flex-col gap-4">
        <div className="pointer-events-auto rounded-2xl bg-surface/85 p-4 backdrop-blur-xl shadow-[24px_0_38px_rgba(33,26,20,0.05)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-primary font-display">Route Suggestion</h2>
            <span className="rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-secondary/15 text-secondary">Eco-Path</span>
          </div>
          <p className="mb-3 text-xs text-ink/60">
            {locationError || 'Ước tính dựa trên vị trí hiện tại của bạn.'}
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-4 rounded-xl bg-surface-low p-3">
              <div className="rounded-lg bg-primary px-2 py-2 text-white">🚶</div>
              <div className="flex-1">
                <p className="text-xs text-ink/60 font-medium">Walking Distance</p>
                <p className="text-sm font-bold text-ink">
                  {routeStats ? `${routeStats.walkingMinutes} mins` : '-'}
                </p>
              </div>
              <div className="text-secondary font-bold text-sm">
                {routeStats ? formatDistance(routeStats.distanceKm) : '-'}
              </div>
            </div>
            <div className="flex items-center gap-4 rounded-xl bg-surface-low p-3 ring-2 ring-primary/10">
              <div className="rounded-lg bg-primary px-2 py-2 text-white">🚲</div>
              <div className="flex-1">
                <p className="text-xs text-ink/60 font-medium">Biking Distance</p>
                <p className="text-sm font-bold text-ink">
                  {routeStats ? `${routeStats.bikingMinutes} mins` : '-'}
                </p>
              </div>
              <div className="text-secondary font-bold text-sm">
                {routeStats ? formatDistance(routeStats.distanceKm) : '-'}
              </div>
            </div>
          </div>
          <button type="button" className="mt-4 w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-white shadow-[0_18px_48px_rgba(33,26,20,0.08)]">
            {selected ? `Navigate to ${selected.name || selected.title}` : 'Start Navigation'}
          </button>
        </div>

        <div className="pointer-events-auto rounded-2xl bg-surface/85 p-4 backdrop-blur-xl shadow-[24px_0_38px_rgba(33,26,20,0.05)]">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-ink/60 mb-4">Map Layers</h3>
          <div className="grid grid-cols-1 gap-2">
            <label className="flex items-center gap-3 rounded-lg p-2 hover:bg-surface-highest cursor-pointer transition-colors">
              <input checked={enabledLayers.events} onChange={() => toggleLayer('events')} className="rounded text-primary focus:ring-primary/30 border-transparent bg-surface-highest" type="checkbox" />
              <span className="text-sm font-medium">Events ({markers.length})</span>
            </label>
            <label className="flex items-center gap-3 rounded-lg p-2 text-ink/50 cursor-not-allowed">
              <input checked={enabledLayers.recycling} onChange={() => toggleLayer('recycling')} className="rounded text-primary focus:ring-primary/30 border-transparent bg-surface-highest" type="checkbox" />
              <span className="text-sm font-medium">Recycling Points (coming soon)</span>
            </label>
            <label className="flex items-center gap-3 rounded-lg p-2 text-ink/50 cursor-not-allowed">
              <input checked={enabledLayers.ecoStations} onChange={() => toggleLayer('ecoStations')} className="rounded text-primary focus:ring-primary/30 border-transparent bg-surface-highest" type="checkbox" />
              <span className="text-sm font-medium">Eco Stations (coming soon)</span>
            </label>
          </div>
        </div>
      </div>

      <aside className="absolute right-0 top-0 bottom-0 z-20 w-full md:w-[320px] bg-surface shadow-[ -32px_0_48px_rgba(33,26,20,0.10)] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div>
            <span className="inline-flex rounded px-2 py-1 text-[10px] font-extrabold uppercase tracking-widest bg-accent text-white">
              Selected
            </span>
            <h2 className="mt-3 text-2xl font-bold font-display text-ink leading-tight">
              {selected?.name || selected?.title || 'Eco Point'}
            </h2>
            <p className="mt-2 text-sm text-ink/60">
              {selected?.type || selected?.category || 'Green station'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-surface-low p-4">
              <p className="text-[10px] uppercase tracking-wider font-bold text-ink/50">Latitude</p>
              <p className="text-sm font-bold">{selected?.latitude?.toFixed?.(4) ?? selected?.lat?.toFixed?.(4) ?? '-'}</p>
            </div>
            <div className="rounded-2xl bg-surface-low p-4">
              <p className="text-[10px] uppercase tracking-wider font-bold text-ink/50">Longitude</p>
              <p className="text-sm font-bold">{selected?.longitude?.toFixed?.(4) ?? selected?.lng?.toFixed?.(4) ?? '-'}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-3">Nearby Points</h3>
            <div className="space-y-3">
              {(nearbyMarkers.length > 0 ? nearbyMarkers : markers).slice(0, 6).map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className={`w-full rounded-2xl p-4 text-left transition ${
                    p.id === selectedId ? 'bg-surface-highest' : 'bg-surface-low hover:bg-surface-highest'
                  }`}
                >
                  <p className="font-bold">{p.name || p.title || 'Eco Point'}</p>
                  <p className="text-sm text-ink/60">{p.type || p.category || 'Green station'}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default MapExplorerPage;
