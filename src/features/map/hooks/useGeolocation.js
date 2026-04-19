// useGeolocation Hook
import { useState, useEffect, useCallback } from 'react';

const GEOLOCATION_UNSUPPORTED_MESSAGE = 'TrĂ¬nh duyá»‡t khĂ´ng há»— trá»£ Ä‘á»‹nh vá»‹';
const GEOLOCATION_FAILED_MESSAGE = 'KhĂ´ng thá»ƒ láº¥y vá»‹ trĂ­';
const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 60000,
};

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(() =>
    typeof navigator !== 'undefined' && !navigator.geolocation
      ? GEOLOCATION_UNSUPPORTED_MESSAGE
      : null,
  );
  const [isLoading, setIsLoading] = useState(() =>
    typeof navigator !== 'undefined' && !!navigator.geolocation,
  );

  const getLocation = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setError(GEOLOCATION_UNSUPPORTED_MESSAGE);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setError(null);
        setIsLoading(false);
      },
      (err) => {
        setError(err.message || GEOLOCATION_FAILED_MESSAGE);
        setIsLoading(false);
      },
      GEOLOCATION_OPTIONS,
    );
  }, []);

  const watchLocation = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setError(GEOLOCATION_UNSUPPORTED_MESSAGE);
      return null;
    }

    return navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setError(null);
      },
      (err) => setError(err.message || GEOLOCATION_FAILED_MESSAGE),
      { enableHighAccuracy: true },
    );
  }, []);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setError(null);
        setIsLoading(false);
      },
      (err) => {
        setError(err.message || GEOLOCATION_FAILED_MESSAGE);
        setIsLoading(false);
      },
      GEOLOCATION_OPTIONS,
    );
  }, []);

  return {
    location,
    error,
    isLoading,
    getLocation,
    watchLocation,
  };
};

export default useGeolocation;
