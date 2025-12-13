import React, { useState } from 'react';
import type { APIResponse } from '../types';

interface FooterProps {
    data: APIResponse | null;
}

const Footer: React.FC<FooterProps> = ({ data }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    // Parse characters from data
    const characters = React.useMemo(() => {
        if (!data) return [];
        return Object.keys(data).map(key => {
            const parts = key.split('_');
            // Assuming format Name_Region_Server or FirstName_LastName_Server_Region
            // Robust check: Last=Region, SecondLast=Server, Rest=Name
            if (parts.length < 3) return null;

            const region = parts[parts.length - 1];
            const server = parts[parts.length - 2];
            // Name is everything else joined by space (or underscore if preferred, but usually display is space)
            // But if key uses underscores, we might want to display underscores or spaces?
            // "The text should be <name> - <server> in title case"
            // If parts[0...len-2] are components of name.
            const nameParts = parts.slice(0, parts.length - 2);
            // Capitalize each part for Title Case if logic requires, but usually API gives proper casing.
            // Let's assume API casing is mostly fine or we capitalize first letter.
            const name = nameParts.join(' ');

            return {
                name,
                server,
                region,
                displayName: `${name} - ${server}`, // Display Name - Server
                url: `https://www.fflogs.com/character/${region.toLowerCase()}/${server.toLowerCase()}/${nameParts.join('%20').toLowerCase()}`
                // Note: FFLogs URL typically handles spaces as %20 or just works. Using nameParts joined by space for display, %20 for URL? 
                // Wait, FFLogs usually works with firstname same? 
                // URL: /region/server/firstname%20lastname
            };
        }).filter(Boolean) as { name: string, server: string, region: string, displayName: string, url: string }[];
    }, [data]);

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsDropdownOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setIsDropdownOpen(false);
        }, 300); // 300ms delay
    };

    const linkStyle = {
        color: '#666',
        textDecoration: 'none',
        fontSize: '0.9rem',
        margin: '0 1rem',
        cursor: 'pointer',
        transition: 'color 0.2s'
    };

    const activeLinkStyle = {
        ...linkStyle,
        color: '#fff'
    };

    return (
        <footer style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '1.5rem', // Reduced padding slightly
            borderTop: '1px solid #222',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#0d0d0d', // Match body background
            zIndex: 1000
        }}>
            {/* Home */}
            <a href="/" style={linkStyle} onMouseOver={e => e.currentTarget.style.color = '#fff'} onMouseOut={e => e.currentTarget.style.color = '#666'}>
                Home
            </a>

            {/* FFLogs Dropup */}
            <div
                style={{ position: 'relative', display: 'inline-block' }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <span style={isDropdownOpen ? activeLinkStyle : linkStyle}>FFLogs</span>

                {isDropdownOpen && (
                    <div style={{
                        position: 'absolute',
                        bottom: '100%', // DropUP
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#111',
                        border: '1px solid #333',
                        padding: '0.5rem 0',
                        borderRadius: '4px',
                        minWidth: '200px',
                        marginBottom: '0.5rem',
                        zIndex: 100,
                        boxShadow: '0 -4px 12px rgba(0,0,0,0.5)'
                    }}>
                        {characters.map((char, i) => (
                            <a
                                key={i}
                                href={char.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'block',
                                    padding: '0.5rem 1rem',
                                    color: '#888',
                                    textDecoration: 'none',
                                    fontSize: '0.85rem',
                                    whiteSpace: 'nowrap'
                                }}
                                onMouseOver={e => {
                                    e.currentTarget.style.color = '#fff';
                                    e.currentTarget.style.backgroundColor = '#222';
                                }}
                                onMouseOut={e => {
                                    e.currentTarget.style.color = '#888';
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                            >
                                {char.displayName}
                            </a>
                        ))}
                    </div>
                )}
            </div>

            {/* Tomestone */}
            <a
                href="https://tomestone.gg/character/36783855/ugrend-starlight"
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
                onMouseOver={e => e.currentTarget.style.color = '#fff'}
                onMouseOut={e => e.currentTarget.style.color = '#666'}
            >
                Tomestone
            </a>

            {/* Screenshots */}
            <a
                href="/screenshots"
                style={linkStyle}
                onMouseOver={e => e.currentTarget.style.color = '#fff'}
                onMouseOut={e => e.currentTarget.style.color = '#666'}
            >
                Screenshots
            </a>

            {/* Art */}
            <a
                href="https://korelael.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
                onMouseOver={e => e.currentTarget.style.color = '#fff'}
                onMouseOut={e => e.currentTarget.style.color = '#666'}
            >
                Art
            </a>
        </footer>
    );
};

export default Footer;
