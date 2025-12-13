import React, { useState, useEffect } from 'react';
import type { APIResponse } from '../types';
import RegionFilter from './RegionFilter';
import ZoneSelector from './ZoneSelector';
import RankingTable from './RankingTable';
import Footer from './Footer';

const Dashboard: React.FC = () => {
    const [data, setData] = useState<APIResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRegion, setSelectedRegion] = useState<string>('All');
    const [selectedZone, setSelectedZone] = useState<string>('');

    // Fetch data on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch from our proxy route
                const res = await fetch('/api/fflogs/');
                if (!res.ok) throw new Error('Failed to fetch data');
                const jsonData = await res.json();
                console.log("Fetched Data:", jsonData); // Debug Log
                setData(jsonData);
            } catch (err: any) {
                console.error("Fetch Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Derived lists of zones from data, separated by difficulty
    const { zones_101, availableRegions } = React.useMemo(() => {
        const z101 = new Set<string>();
        const regions = new Set<string>();

        if (data) {
            Object.entries(data).forEach(([key, charRegions]) => {
                // Robust parsing: Last part is Region, Second-Last is Server
                const parts = key.split('_');
                // Only proceed if we have enough parts for at least Name_Server_Region (3 parts)
                if (parts.length >= 3) {
                    const region = parts[parts.length - 1].toUpperCase();
                    regions.add(region);
                }

                Object.values(charRegions).forEach(zoneData => {
                    if (zoneData.difficulty === 101) {
                        z101.add(zoneData.name);
                    }
                });
            });
        }

        // Sort alphabetically, then reverse so latest is first (AAC Light vs AAC Cruiser)
        const sorted101 = Array.from(z101).sort().reverse();
        const sortedRegions = Array.from(regions).sort();

        return { zones_101: sorted101, availableRegions: sortedRegions };
    }, [data]);


    // Set default zone when data loads
    useEffect(() => {
        if (zones_101.length > 0 && !selectedZone) {
            setSelectedZone(zones_101[zones_101.length - 1]);
        }
    }, [zones_101, selectedZone]);

    if (loading) return <div style={{ padding: '2rem', color: '#fff' }}>Loading data...</div>;
    if (error) return <div style={{ padding: '2rem', color: 'red' }}>Error: {error}</div>;
    if (!data) return <div style={{ padding: '2rem', color: '#fff' }}>No data found.</div>;

    return (
        <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '2rem',
            paddingBottom: '100px', // Space for fixed footer
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <RegionFilter
                    regions={availableRegions}
                    selectedRegion={selectedRegion}
                    onSelect={setSelectedRegion}
                />
                <ZoneSelector
                    zones={zones_101}
                    selectedZone={selectedZone}
                    onSelect={setSelectedZone}
                />
            </header>

            <div style={{ flex: 1 }}>
                <RankingTable
                    data={data}
                    selectedRegion={selectedRegion}
                    selectedZone={selectedZone}

                />
            </div>

            <Footer data={data} />
        </div>
    );
};

export default Dashboard;
