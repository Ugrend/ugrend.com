export type Regions = "combined" | "na" | "oc";
export type Jobs = "Warrior" | "Dark Knight" | "Gunbreaker" | "Monk" | "Samari" | "Reaper" | "Ninja" | "Black Mage" | "Summoner" | "Dancer" | "Bard" | "Machinist" | "White Mage" | "Scholar" | "Sage" | "Astrologian"
export type CombatInfo = {
  Name: string
  CurrentHP: number
  MaxHp: number
}

export type PlayerData = {
  Name: string
  Location: string
  CurrentServer: string
  HomeServer: string
  SessionStart: string
  InCombat: boolean
  CombatInfo?: CombatInfo
}

