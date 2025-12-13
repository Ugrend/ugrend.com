import React from 'react';

interface ZoneSelectorProps {
    zones: string[];
    selectedZone: string;
    onSelect: (zone: string) => void;
}

const ZoneSelector: React.FC<ZoneSelectorProps> = ({ zones, selectedZone, onSelect }) => {
    const selectorStyle: React.CSSProperties = {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '1rem'
    };

    const itemStyle = (isActive: boolean): React.CSSProperties => ({
        cursor: 'pointer',
        padding: '0.25rem 0',
        color: isActive ? 'var(--accent-color)' : 'var(--dim-color)',
        borderBottom: isActive ? '2px solid var(--accent-color)' : '2px solid transparent',
        transition: 'all 0.2s ease',
        textTransform: 'uppercase',
        fontSize: '0.9rem',
        letterSpacing: '0.05em'
    });

    return (
        <div style={selectorStyle}>
            {zones.map(zone => (
                <div
                    key={zone}
                    style={itemStyle(selectedZone === zone)}
                    onClick={() => onSelect(zone)}
                >
                    {zone}
                </div>
            ))}
        </div>
    );
};

export default ZoneSelector;
