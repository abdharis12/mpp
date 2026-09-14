import { useEffect, useMemo, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function FixMapAutoInvalidate() {
    const map = useMap();
    useEffect(() => {
        setTimeout(() => map.invalidateSize(), 100);
    }, [map]);
    return null;
}

function FitCenter({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.setView(center, 17);
    }, [map, center]);
    return null;
}

function ClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
    const map = useMap();
    useEffect(() => {
        const handler = (e: L.LeafletMouseEvent) => {
            onClick(e.latlng.lat, e.latlng.lng);
        };
        map.on('click', handler);
        return () => { map.off('click', handler); };
    }, [map, onClick]);
    return null;
}

const locationIcon = new L.DivIcon({
    html: '<div style="width:16px;height:16px;background:#2563EB;border:3px solid #fff;border-radius:50%;box-shadow:0 0 6px rgba(0,0,0,.35)"></div>',
    className: '',
    iconSize: [16, 16],
    iconAnchor: [8, 8],
});

type Props = {
    latitude: number;
    longitude: number;
    radius: number;
    onChange: (lat: number, lng: number) => void;
};

export default function AdminLocationMap({ latitude, longitude, radius, onChange }: Props) {
    const [mounted, setMounted] = useState(false);
    const center = useMemo<[number, number]>(() => [latitude, longitude], [latitude, longitude]);
    const handleMarkerDrag = useCallback(
        (e: L.DragEndEvent) => {
            const pos = e.target.getLatLng();
            onChange(pos.lat, pos.lng);
        },
        [onChange]
    );
    const handleClick = useCallback(
        (lat: number, lng: number) => {
            onChange(lat, lng);
        },
        [onChange]
    );

    useEffect(() => { setMounted(true); }, []);

    if (!mounted) {
        return <div className="h-64 w-full animate-pulse rounded-md bg-muted" />;
    }

    return (
        <div className="overflow-hidden rounded-md border border-border">
            <MapContainer center={center} zoom={17} scrollWheelZoom={true} className="h-96 w-full">
                <FixMapAutoInvalidate />
                <FitCenter center={center} />
                <ClickHandler onClick={handleClick} />
                <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="Peta">
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Satelit">
                        <TileLayer
                            attribution='&copy; Esri, Maxar, Earthstar Geographics'
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        />
                    </LayersControl.BaseLayer>
                </LayersControl>
                <Circle center={center} radius={radius} pathOptions={{ color: '#2563EB', fillColor: '#2563EB', fillOpacity: 0.08, weight: 2 }} />
                <Marker position={center} icon={locationIcon} draggable={true} eventHandlers={{ dragend: handleMarkerDrag }} />
            </MapContainer>
            <div className="flex items-center justify-center gap-1.5 bg-background/80 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
                Klik peta atau geser marker untuk mengatur posisi
            </div>
        </div>
    );
}
