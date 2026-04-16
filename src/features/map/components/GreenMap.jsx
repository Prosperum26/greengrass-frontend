import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mapApi } from '../../../api';

const defaultCenter = [10.8803, 106.8023];

const baseIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const selectedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const FlyToLocation = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 14, { duration: 0.8 });
  }, [map, center]);
  return null;
};

export const GreenMap = ({ 
  center = defaultCenter,
  markers: markersProp,
  selectedId,
  onSelect,
}) => {
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    if (markersProp) return;
    const loadEcoPoints = async () => {
      try {
        const { data } = await mapApi.getEcoPoints();
        const points = Array.isArray(data) ? data : data?.data || [];
        setMarkers(points);
      } catch {
        setMarkers([]);
      }
    };
    void loadEcoPoints();
  }, [markersProp]);

  useEffect(() => {
    if (!markersProp) return;
    setMarkers(markersProp);
  }, [markersProp]);

  useEffect(() => {
    if (!selectedId) return;
    const found = markers.find((m) => m.id === selectedId);
    if (found) setSelected(found);
  }, [markers, selectedId]);

  const mapCenter = useMemo(() => {
    if (selected) return [selected.latitude, selected.longitude];
    return center;
  }, [center, selected]);

  return (
    <MapContainer center={mapCenter} zoom={13} className="h-full w-full">
      <FlyToLocation center={mapCenter} />
      <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {markers.map((point) => (
        <Marker
          key={point.id}
          position={[point.latitude, point.longitude]}
          icon={selected?.id === point.id ? selectedIcon : baseIcon}
          eventHandlers={{
            click: () => {
              setSelected(point);
              onSelect?.(point);
            },
          }}
        >
          <Popup>
            <div>
              <strong>{point.name || point.title || 'Eco Point'}</strong>
              <p>{point.type || point.category || 'Green collection point'}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default GreenMap;
