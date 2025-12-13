import React, { useMemo } from 'react';
import type { APIResponse, ZoneRankingData, Ranking } from '../types';

interface RankingTableProps {
    data: APIResponse | null;
    selectedRegion: string;
    selectedZone: string;
    zones_101: string[];
    zones_100: string[];
}

interface AggregatedEncounter {
    encounterName: string;
    encounterId: number;
    bestPercent: number;
    medianPercent: number;
    kills: number;
    rank: number | string;
    zoneName: string;
    zoneId: number;
    difficulty: number;
}

// FFLogs Color Map
const COLOR_GRADES = {
    ff100: "#e5cc80",
    ff99: "#e268a8",
    ff95: "#ff8000",
    ff75: "#a335ee",
    ff50: "#0070ff",
    ff25: "#1eff00",
    ff0: "#666666"
};

const getPercentColor = (value: number) => {
    if (value === 100) return COLOR_GRADES.ff100;
    if (value >= 99) return COLOR_GRADES.ff99;
    if (value >= 95) return COLOR_GRADES.ff95;
    if (value >= 75) return COLOR_GRADES.ff75;
    if (value >= 50) return COLOR_GRADES.ff50;
    if (value >= 25) return COLOR_GRADES.ff25;
    return COLOR_GRADES.ff0;
};

const ANIMATION_DURATION = 800; // ms

// Custom hook to animate value
const useAnimatedValue = (target: number, duration: number = ANIMATION_DURATION) => {
    const [displayValue, setDisplayValue] = React.useState(target);
    const frameRef = React.useRef<number>();
    const startTimeRef = React.useRef<number>();
    const startValueRef = React.useRef<number>(target);

    React.useEffect(() => {
        startValueRef.current = displayValue;
        startTimeRef.current = undefined;
        const change = target - startValueRef.current;

        if (change === 0) return;

        const animate = (timestamp: number) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp;
            const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);

            // Linear interpolation 
            const ease = progress;

            setDisplayValue(startValueRef.current + change * ease);

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate);
            } else {
                setDisplayValue(target); // Ensure exact finish
            }
        };

        frameRef.current = requestAnimationFrame(animate);

        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [target, duration]);

    return displayValue;
};

const RankingRow: React.FC<{ row: AggregatedEncounter }> = ({ row }) => {
    // Animate Best and Median
    const animatedBest = useAnimatedValue(row.bestPercent);
    const animatedMedian = useAnimatedValue(row.medianPercent);
    const animatedKills = useAnimatedValue(row.kills);

    // Handle Rank animation carefully (might be string '-')
    const rankNum = typeof row.rank === 'number' ? row.rank : 0;
    const animatedRank = useAnimatedValue(rankNum);

    // FIX: Show dashes if kills is 0
    const hasKills = row.kills > 0;

    return (
        <tr style={{ borderBottom: '1px solid #222' }}>
            <td style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <img
                    src={`/assets/imgs/${row.encounterId}-icon.jpg`}
                    alt=""
                    style={{ width: '20px', height: '20px', borderRadius: '2px', objectFit: 'cover', backgroundColor: '#222' }}
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.visibility = 'hidden';
                    }}
                />
                {row.encounterName}
            </td>
            {/* Best % */}
            <td style={{ padding: '0.75rem', color: hasKills ? getPercentColor(animatedBest) : '#aaa', fontWeight: hasKills ? 'bold' : 'normal' }}>
                {hasKills ? Math.floor(animatedBest) : '-'}
            </td>
            {/* Median % */}
            <td style={{ padding: '0.75rem', color: hasKills ? getPercentColor(animatedMedian) : '#aaa' }}>
                {hasKills ? Math.floor(animatedMedian) : '-'}
            </td>
            {/* Kills */}
            <td style={{ padding: '0.75rem', color: '#aaa' }}>
                {hasKills ? Math.floor(animatedKills) : '-'}
            </td>
            {/* Rank - Colored by Best% */}
            <td style={{ padding: '0.75rem', color: hasKills ? getPercentColor(animatedBest) : '#aaa' }}>
                {hasKills ? (typeof row.rank === 'number' ? Math.floor(animatedRank) : '-') : '-'}
            </td>
        </tr>
    );
};

const RankingTable: React.FC<RankingTableProps> = ({ data, selectedRegion, selectedZone, zones_101, zones_100 }) => {

    // 1. Flatten all relevant character data based on region selection
    const relevantCharacters = useMemo(() => {
        if (!data) return [];
        const chars: { name: string, data: { [key: string]: ZoneRankingData } }[] = [];
        Object.entries(data).forEach(([key, charData]) => {
            const parts = key.split('_');
            if (parts.length < 4) return;
            const region = parts[parts.length - 1].toUpperCase();
            if (selectedRegion === 'All' || region === selectedRegion) {
                chars.push({ name: key, data: charData });
            }
        });
        return chars;
    }, [data, selectedRegion]);

    // 2. Helper to aggregate rankings. Can filter by specific zone name OR just difficulty.
    const aggregateRankings = (difficulty: number, targetZoneName?: string) => {
        const encounterMap = new Map<string, AggregatedEncounter>();

        relevantCharacters.forEach(char => {
            Object.values(char.data).forEach(zoneParams => {
                // Filter by difficulty
                if (zoneParams.difficulty !== difficulty) return;

                // If a specific zone name is requested, filter by it.
                if (targetZoneName && zoneParams.name !== targetZoneName) return;

                zoneParams.rankings.forEach(ranking => {
                    const encName = ranking.encounter.name;
                    // For Difficulty 100, we aggregate ALL encounters with same name regardless of zone

                    if (!encounterMap.has(encName)) {
                        encounterMap.set(encName, {
                            encounterName: encName,
                            encounterId: ranking.encounter.id, // Capture ID
                            bestPercent: 0,
                            medianPercent: 0,
                            kills: 0,
                            rank: 9999999, // placeholder for min
                            zoneName: zoneParams.name,
                            zoneId: zoneParams.zone,
                            difficulty: zoneParams.difficulty
                        });
                    }

                    const current = encounterMap.get(encName)!;

                    if (ranking.rankPercent && ranking.rankPercent > current.bestPercent) {
                        current.bestPercent = ranking.rankPercent;
                    }

                    if (ranking.medianPercent && ranking.medianPercent > current.medianPercent) {
                        current.medianPercent = ranking.medianPercent;
                    }

                    current.kills += ranking.totalKills;

                    if (ranking.allStars) {
                        if (ranking.allStars.rank < (current.rank as number)) {
                            current.rank = ranking.allStars.rank;
                        }
                    }
                });
            });
        });

        return Array.from(encounterMap.values()).map(e => ({
            ...e,
            rank: e.rank === 9999999 ? '-' : e.rank
        }));
    };

    const mainTableData = useMemo(() => {
        if (!selectedZone) return [];
        return aggregateRankings(101, selectedZone);
    }, [relevantCharacters, selectedZone]);

    const ultTableData = useMemo(() => {
        // Aggregate ALL difficulty 100 zones together
        return aggregateRankings(100);
    }, [relevantCharacters]);

    if (!data) return null;
    if (mainTableData.length === 0 && ultTableData.length === 0) return <div>No data to display</div>;

    return (
        <div style={{ marginBottom: '3rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--dim-color)' }}>
                        <th style={{ padding: '0.75rem', fontWeight: 'normal' }}>Boss</th>
                        <th style={{ padding: '0.75rem', fontWeight: 'normal' }}>Best %</th>
                        <th style={{ padding: '0.75rem', fontWeight: 'normal' }}>Median %</th>
                        <th style={{ padding: '0.75rem', fontWeight: 'normal' }}>Kills</th>
                        <th style={{ padding: '0.75rem', fontWeight: 'normal' }}>Rank</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Main Zone Rows */}
                    {mainTableData.map((row, i) => (
                        <RankingRow key={`main-${row.encounterName}-${i}`} row={row} />
                    ))}

                    {/* Spacer */}
                    {mainTableData.length > 0 && ultTableData.length > 0 && (
                        <tr style={{ height: '2rem' }}>
                            <td colSpan={5}></td>
                        </tr>
                    )}

                    {/* Ultimate Rows */}
                    {ultTableData.map((row, i) => (
                        <RankingRow key={`ult-${row.encounterName}-${i}`} row={row} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RankingTable;
