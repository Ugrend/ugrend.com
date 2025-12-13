import React from 'react';

interface RegionFilterProps {
    regions: string[];
    selectedRegion: string;
    onSelect: (region: string) => void;
}

const RegionFilter: React.FC<RegionFilterProps> = ({ regions, selectedRegion, onSelect }) => {
    return (
        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
                className={selectedRegion === 'All' ? 'active' : ''}
                onClick={() => onSelect('All')}
            >
                All
            </button>
            {regions.map(region => (
                <button
                    key={region}
                    className={selectedRegion === region ? 'active' : ''}
                    onClick={() => onSelect(region)}
                >
                    {region}
                </button>
            ))}
        </div>
    );
};

export default RegionFilter;
