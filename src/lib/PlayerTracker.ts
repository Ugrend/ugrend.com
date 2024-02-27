import { PlayerData } from "@/types";

class PlayerTracker{
  private lastChecked: Date = new Date();
  private CurrentStats: PlayerData|null = null;
  constructor(){
  }

  updateStats(playerData: PlayerData){
    this.CurrentStats = playerData;
    this.lastChecked = new Date();
  }
  getStats(){
    const check = this.CurrentStats != null && new Date() > new Date(this.lastChecked.getTime() + 10 * 1000) 
    if(check){
      this.CurrentStats = null;
    }
    return this.CurrentStats;
  }
}

export default new PlayerTracker();
