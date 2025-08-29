import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
  longitude?: number;
  latitude?: number;
  zoom?: number;
  className?: string;
}

const Map: React.FC<MapProps> = ({ 
  longitude = 0, 
  latitude = 0, 
  zoom = 13,
  className = "w-full h-[300px]"
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Set Mapbox access token
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2FsbWFuanNpaHNod2p3MTIiLCJhIjoiY21ldzJkZ2R3MGdvYTJrcjExaDl0MWVjayJ9.VZ27-FRiydUygYfsywoPcA';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [longitude, latitude],
      zoom: zoom,
    });

    // Add marker if coordinates are provided
    if (longitude !== 0 || latitude !== 0) {
      new mapboxgl.Marker()
        .setLngLat([longitude, latitude])
        .addTo(map.current);
    }

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [longitude, latitude, zoom]);

  return (
    <div className={className}>
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
    </div>
  );
};

export default Map;