import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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


    const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);

    // WebSocket connection for player name
    useEffect(() => {
        const socket = new WebSocket("ws://127.0.0.1:10501/ws");

        socket.addEventListener("message", (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data["combatants"]) {
                    // Assuming we want the first combatant or specific logic
                    // The user's snippet uses data["combatants"][0].Name
                    if (data["combatants"].length > 0) {
                        setCurrentPlayer(data["combatants"][0].Name);
                    }
                }
            } catch (e) {
                console.error("Failed to parse WS message", e);
            }
        });

        const timer = setTimeout(() => {
            try {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({ "call": "getCombatants" }));
                } else {
                    socket.addEventListener('open', () => {
                        socket.send(JSON.stringify({ "call": "getCombatants" }));
                    });
                }
            } catch (e) {
                console.error("WS Send error", e);
            }
        }, 2000);

        return () => {
            try {
                socket.close();
            } catch { }
            clearTimeout(timer);
        };
    }, []);

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
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{ marginBottom: '4rem', marginTop: '2rem' }}
            >
                <div style={{
                    fontSize: '2rem',
                    color: 'var(--dim-color)',
                    fontWeight: '300',
                    lineHeight: '1',
                    marginBottom: '0.5rem',
                    minHeight: '2rem' // Prevent layout shift
                }}>
                    {currentPlayer ? (
                        <>Hi <Typewriter text={currentPlayer + " :3"} /></>
                    ) : (
                        "Hi"
                    )}
                    {"!"}
                </div>
                <div style={{
                    fontSize: '3rem',
                    fontWeight: 'bold',
                    color: 'var(--accent-color)',
                    lineHeight: '1',
                    letterSpacing: '-0.02em',
                    // Gradient text effect for "stand out"
                    background: 'linear-gradient(to right, #fff, #aaa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    I'm Ugrend!
                </div>
            </motion.div>

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

const Typewriter: React.FC<{ text: string }> = ({ text }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        setDisplayedText("");
        setIsFinished(false);
        let currentIndex = 0;

        const interval = setInterval(() => {
            currentIndex++;
            setDisplayedText(text.slice(0, currentIndex));

            if (currentIndex >= text.length) {
                setIsFinished(true);
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [text]);

    return (
        <span style={{ display: 'inline-block', minWidth: '1ch' }}>
            {displayedText}
            {!isFinished && (
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    style={{
                        display: 'inline-block',
                        width: '2px',
                        height: '1em',
                        background: 'currentColor',
                        marginLeft: '2px',
                        verticalAlign: 'text-bottom'
                    }}
                />
            )}
        </span>
    );
};

export default Dashboard;
