import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const MapView = ({ markers = [], center = [12.8167, 121.4667], zoom = 13, onMarkerClick }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        // Only initialize if map doesn't exist
        if (!mapInstanceRef.current && mapRef.current) {
            mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapInstanceRef.current);
        }

        // Update markers
        if (mapInstanceRef.current) {
            // Clear existing markers
            mapInstanceRef.current.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    mapInstanceRef.current.removeLayer(layer);
                }
            });

            // Add new markers with click event
            markers.forEach((marker) => {
                const mapMarker = L.marker([marker.lat, marker.lng])
                    .addTo(mapInstanceRef.current);

                // Add popup with basic info
                const popupContent = `
                    <div style="min-width: 200px;">
                        <h3 style="font-weight: 600; margin-bottom: 8px; color: #1f2937;">${marker.label || 'Report Location'}</h3>
                        ${marker.animalName ? `<p style="font-size: 14px; color: #6b7280; margin-bottom: 4px;">Animal: ${marker.animalName}</p>` : ''}
                        ${marker.description ? `<p style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">${marker.description}</p>` : ''}
                        ${onMarkerClick ? '<button style="background: #dc2626; color: white; padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; font-size: 14px; font-weight: 500; width: 100%;">View Details</button>' : ''}
                    </div>
                `;

                mapMarker.bindPopup(popupContent);

                // Add click event to open modal
                if (onMarkerClick) {
                    mapMarker.on('click', () => {
                        onMarkerClick(marker);
                    });
                }
            });
        }

        // Cleanup function
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [markers, center, zoom]);

    return (
        <div
            ref={mapRef}
            style={{ height: '400px', width: '100%', borderRadius: '1rem', zIndex: 1 }}
            className="rounded-2xl border border-gray-200 relative"
        />
    );
};

export default MapView;
