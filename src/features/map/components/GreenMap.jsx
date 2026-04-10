// Green Map Component (Leaflet integration placeholder)
import { useEffect, useRef } from 'react';

export const GreenMap = ({ 
  center = [10.869778, 106.802583], // ĐHQG-HCM coordinates
  markers = [],
  onMarkerClick,
  userLocation,
  showRoute,
}) => {
  const mapRef = useRef(null);

  useEffect(() => {
    // Leaflet map initialization will go here
    // For now, this is a placeholder structure
    console.log('Map initialized with center:', center);
  }, [center]);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-xl overflow-hidden bg-green-50">
      {/* Map placeholder - replace with actual Leaflet map */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7m0 0L9.5 4.786" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">Bản đồ Điểm Xanh</p>
          <p className="text-sm text-gray-400 mt-1">Leaflet map integration</p>
          <p className="text-xs text-gray-400 mt-1">
            Center: {center[0].toFixed(4)}, {center[1].toFixed(4)}
          </p>
        </div>
      </div>
      
      {/* User location indicator */}
      {userLocation && (
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-3">
          <p className="text-sm font-medium text-gray-700">Vị trí của bạn</p>
          <p className="text-xs text-gray-500">
            {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
          </p>
        </div>
      )}
    </div>
  );
};

export default GreenMap;
