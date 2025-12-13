import React, { useEffect, useState, useMemo } from 'react';
import type { APIResponse } from '../types';
import RegionFilter from './RegionFilter';
import ZoneSelector from './ZoneSelector';
import RankingTable from './RankingTable';

const Dashboard: React.FC = () => {
    const [data, setData] = useState<APIResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter states
    const [selectedRegion, setSelectedRegion] = useState<string>('All');
    const [selectedZone, setSelectedZone] = useState<string>('');

    // Fetch data
    useEffect(() => {
        console.log('Fetching /api/fflogs/');
        fetch('/api/fflogs/')
            .then(res => {
                if (!res.ok) throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
                return res.json();
            })
            .then((jsonData: APIResponse) => {
                console.log('Data fetched:', jsonData);
                setData(jsonData);
                setLoading(false);
            })
            .catch(err => {
                console.error('Fetch error:', err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    // Extract available Regions and Zones from data
    const { regions, zones_101, zones_100 } = useMemo(() => {
        if (!data) return { regions: [], zones_101: [], zones_100: [] };

        const regionSet = new Set<string>();
        const zone101Set = new Set<string>();
        const zone100Set = new Set<string>();

        Object.keys(data).forEach(key => {
            // key: Name_Server_Region
            const parts = key.split('_');
            if (parts.length >= 4) {
                // Region is last part
                regionSet.add(parts[parts.length - 1].toUpperCase());
            }

            const charData = data[key];
            Object.values(charData).forEach(zoneVal => {
                // Collect zone names by difficulty
                if (zoneVal.difficulty === 101) {
                    zone101Set.add(zoneVal.name);
                } else if (zoneVal.difficulty === 100) {
                    zone100Set.add(zoneVal.name);
                }
            });
        });

        // Sort for consistency
        return {
            regions: Array.from(regionSet).sort(),
            zones_101: Array.from(zone101Set).sort().reverse(),
            zones_100: Array.from(zone100Set).sort()
        };
    }, [data]);

    // Set default zone if none selected
    useEffect(() => {
        if (!selectedZone && zones_101.length > 0) {
            const lastZone = zones_101[zones_101.length - 1];
            console.log('Setting default zone:', lastZone);
            setSelectedZone(lastZone);
        }
    }, [zones_101, selectedZone]);

    // Render logging
    console.log('Dashboard Render:', {
        loading,
        error,
        hasData: !!data,
        dataKeys: data ? Object.keys(data).length : 0,
        selectedRegion,
        selectedZone,
        zones101Count: zones_101.length
    });

    if (loading) return <div>Loading FFLogs Data...</div>;
    if (error) return <div>Error loading data: {error}</div>;
    if (!data || Object.keys(data).length === 0) return <div>No ranking data available. Please check backend config.</div>;

    return (
        <div>
            <RegionFilter
                regions={regions}
                selectedRegion={selectedRegion}
                onSelect={setSelectedRegion}
            />

            <ZoneSelector
                zones={zones_101}
                selectedZone={selectedZone}
                onSelect={setSelectedZone}
            />

            <RankingTable
                data={data}
                selectedRegion={selectedRegion}
                selectedZone={selectedZone}
                zones_101={zones_101}
                zones_100={zones_100}
            />
        </div>
    );
};

export default Dashboard;
