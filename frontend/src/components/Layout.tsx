import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from './Footer';
import type { APIResponse } from '../types';

export interface LayoutContextType {
    data: APIResponse | null;
    setFooterVisible: (visible: boolean) => void;
}

const Layout: React.FC = () => {
    const [data, setData] = useState<APIResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [footerVisible, setFooterVisible] = useState(true);

    const location = useLocation();

    // Fetch data on mount (Global fetch)
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch from our proxy route
                const res = await fetch('/api/fflogs/');
                if (!res.ok) throw new Error('Failed to fetch data');
                const jsonData = await res.json();
                console.log("Fetched Data in Layout:", jsonData); // Debug Log
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

    // Reset footer visibility on route change
    useEffect(() => {
        setFooterVisible(true);
    }, [location.pathname]);

    if (loading) return <div style={{ padding: '2rem', color: '#fff' }}>Loading data...</div>;
    if (error) return <div style={{ padding: '2rem', color: 'red' }}>Error: {error}</div>;

    const contextValue: LayoutContextType = {
        data,
        setFooterVisible
    };

    return (
        <div style={{
            maxWidth: '1800px',
            margin: '0 auto',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative' // For absolute positioning children if needed
        }}>
            <div style={{ flex: 1 }}>
                <Outlet context={contextValue} />
            </div>

            {/* Conditionally render Footer */}
            {footerVisible && <Footer data={data} />}
        </div>
    );
};

export default Layout;
