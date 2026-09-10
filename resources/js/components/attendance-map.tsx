import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap, LayersControl } from 'react-leaflet';
import L from 'leaflet';

function FixMapAutoInvalidate() {
    const map = useMap();
    useEffect(() => {
        setTimeout(() => map.invalidateSize(), 100);
    }, [map]);
    return null;
}

function FitBounds({ center, radius }: { center: [number, number]; radius: number }) {
    const map = useMap();
    useEffect(() => {
        const distMeters = radius + 50;
        const latRad = (center[0] * Math.PI) / 180;
        const degLat = (distMeters / 111320) * (180 / Math.PI);
        const degLng = (distMeters / (111320 * Math.cos(latRad))) * (180 / Math.PI);
        map.fitBounds(
            [
                [center[0] - degLat, center[1] - degLng],
                [center[0] + degLat, center[1] + degLng],
            ],
            { padding: [30, 30] },
        );
    }, [map, center, radius]);
    return null;
}

const locationIcon = new L.DivIcon({
    html: '<div style="width:14px;height:14px;background:#2563EB;border:3px solid #fff;border-radius:50%;box-shadow:0 0 4px rgba(0,0,0,.3)"></div>',
    className: '',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
});

const gpsIcon = new L.DivIcon({
    html: '<div style="width:14px;height:14px;background:#16A34A;border:3px solid #fff;border-radius:50%;box-shadow:0 0 4px rgba(0,0,0,.3)"></div>',
    className: '',
    iconSize: [14, 14],
    iconAnchor: [7, 7],
});

type Props = {
    locationLatitude: number;
    locationLongitude: number;
    radiusMeter: number;
    gpsLatitude?: number | null;
    gpsLongitude?: number | null;
};

export default function AttendanceMap({
    locationLatitude,
    locationLongitude,
    radiusMeter,
    gpsLatitude,
    gpsLongitude,
}: Props) {
    const [mounted, setMounted] = useState(false);
    const center = useMemo<[number, number]>(() => [locationLatitude, locationLongitude], [locationLatitude, locationLongitude]);
    const gpsPos = gpsLatitude != null && gpsLongitude != null ? ([gpsLatitude, gpsLongitude] as [number, number]) : null;

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="h-56 w-full animate-pulse rounded-md bg-muted" />;
    }

    return (
        <div className="overflow-hidden rounded-md border border-border">
            <MapContainer center={center} zoom={17} scrollWheelZoom={true} className="h-56 w-full">
                <FixMapAutoInvalidate />
                <FitBounds center={center} radius={radiusMeter} />
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
                <Circle center={center} radius={radiusMeter} pathOptions={{ color: '#2563EB', fillColor: '#2563EB', fillOpacity: 0.08, weight: 2 }} />
                <Marker position={center} icon={locationIcon} />
                {gpsPos && <Marker position={gpsPos} icon={gpsIcon} />}
            </MapContainer>
        </div>
    );
}
