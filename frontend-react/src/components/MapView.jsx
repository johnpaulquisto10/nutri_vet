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

// Red pin icon
const redPinIcon = L.icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="45" viewBox="0 0 32 45">
            <path fill="#dc2626" stroke="#991b1b" stroke-width="2" d="M16 0C9.373 0 4 5.373 4 12c0 9 12 28 12 28s12-19 12-28c0-6.627-5.373-12-12-12z"/>
            <circle cx="16" cy="12" r="5" fill="white"/>
        </svg>
    `),
    iconSize: [32, 45],
    iconAnchor: [16, 45],
    popupAnchor: [0, -45]
});

// Pulsing dot icon
const pulsingDotIcon = L.divIcon({
    className: 'custom-pulsing-dot',
    html: `
        <style>
            .pulsing-dot {
                width: 16px;
                height: 16px;
                background: #dc2626;
                border: 3px solid #fee2e2;
                border-radius: 50%;
                position: relative;
                animation: pulse 2s infinite;
            }
            @keyframes pulse {
                0% {
                    box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7);
                }
                50% {
                    box-shadow: 0 0 0 15px rgba(220, 38, 38, 0);
                }
                100% {
                    box-shadow: 0 0 0 0 rgba(220, 38, 38, 0);
                }
            }
        </style>
        <div class="pulsing-dot"></div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -11]
});

const MapView = ({ markers = [], center = [12.8167, 121.4667], zoom = 13, onMarkerClick, onMapClick, markerType = 'default' }) => {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersLayerRef = useRef(null);

    // Initialize map only once
    useEffect(() => {
        if (!mapInstanceRef.current && mapRef.current) {
            mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapInstanceRef.current);

            // Create a layer group for markers
            markersLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);

            // Add click handler if onMapClick is provided
            if (onMapClick) {
                mapInstanceRef.current.on('click', (e) => {
                    onMapClick(e.latlng.lat, e.latlng.lng);
                });
            }
        }

        // Cleanup function - only remove on component unmount
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                markersLayerRef.current = null;
            }
        };
    }, []);

    // Update markers when they change
    useEffect(() => {
        if (mapInstanceRef.current && markersLayerRef.current) {
            // Clear existing markers
            markersLayerRef.current.clearLayers();

            console.log('Adding markers to map:', markers.length);

            // Add new markers
            markers.forEach((marker) => {
                // Select icon based on markerType
                let icon;
                if (markerType === 'pin') {
                    icon = redPinIcon;
                } else if (markerType === 'pulsing') {
                    icon = pulsingDotIcon;
                }

                const markerOptions = icon ? { icon } : {};
                const mapMarker = L.marker([marker.lat, marker.lng], markerOptions);

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

                // Add marker to layer group
                mapMarker.addTo(markersLayerRef.current);
            });

            // Adjust map view to fit all markers if there are any
            if (markers.length > 0) {
                const bounds = L.latLngBounds(markers.map(m => [m.lat, m.lng]));
                mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
            }
        }
    }, [markers, markerType, onMarkerClick]);

    return (
        <div
            ref={mapRef}
            style={{ height: '100%', width: '100%', borderRadius: '1rem', zIndex: 1 }}
            className="rounded-2xl border border-gray-200 relative h-full"
        />
    );
};

export default MapView;
