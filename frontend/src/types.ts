export interface Encounter {
    id: number;
    name: string;
}

export interface AllStars {
    rank: number;
    regionRank: number;
    serverRank: number;
    rankPercent: number | string;
    total: number;
}

export interface Ranking {
    encounter: Encounter;
    rankPercent: number | null;
    medianPercent: number | null;
    lockedIn: boolean;
    totalKills: number;
    fastestKill: number;
    allStars: AllStars | null;
    spec: string | null;
}

export interface ZoneRankingData {
    name: string;
    difficulty: number;
    zone: number;
    rankings: Ranking[];
}

export interface CharacterData {
    [key: string]: ZoneRankingData;
}

export interface Dictionary<T> {
    [key: string]: T;
}

// key is "Name_Server_Region"
export type APIResponse = Dictionary<Dictionary<ZoneRankingData>>;
