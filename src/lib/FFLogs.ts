import { Jobs } from "@/types";

const FF_LOGS_BASE_API_URI = "https://www.fflogs.com/api/v2/client";
const FF_LOGS_TOKEN_URI =  "https://www.fflogs.com/oauth/token";
const FF_LOGS_CLIENT = process.env.FF_LOGS_CLIENT;
const FF_LOGS_SECRET = process.env.FF_LOGS_SECRET;
const SAVAGE_ZONE_ID = 62;
type FFLogsOauthToken = {
  token_type: string;
  expires_in: number;
  access_token: string;
  expires: Date;
}

export type FFLogsBossParse = {
  boss: string;
  rankPercent: number;
  medianPercent: number;
  kills: number;
  job: Jobs
  rank: number;
}
export type FFLogsResponse = {
  savage: FFLogsBossParse[];
  ultimates: FFLogsBossParse[];
}

const getToken = async (): Promise<FFLogsOauthToken> => {
  console.log("Logging into FFLogs")
  const req = await fetch(FF_LOGS_TOKEN_URI, {
    method: "POST", 
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: FF_LOGS_CLIENT,
      client_secret: FF_LOGS_SECRET
    })
  })
  if(req.status !== 200)
    throw new Error(JSON.stringify(req.json()));
  const json = await req.json();
  const currentTime = new Date();
  return Object.assign({}, json, {expires: currentTime.setMilliseconds(currentTime.getMilliseconds() + json.expires_in)})
  
}
const minifyOutput = (fflogsPayload: any): FFLogsResponse => {
  const savage: any[] = fflogsPayload["data"]["characterData"]["character"][`Zone${SAVAGE_ZONE_ID}diff101`]["rankings"]
  const ultimates: any[] = fflogsPayload["data"]["characterData"]["character"]["Zone43diff100"]["rankings"]
  ultimates.push(...fflogsPayload["data"]["characterData"]["character"]["Zone45diff100"]["rankings"])
  ultimates.push(...fflogsPayload["data"]["characterData"]["character"]["Zone53diff100"]["rankings"])
  ultimates.push(...fflogsPayload["data"]["characterData"]["character"]["Zone65diff100"]["rankings"])
  const encounterMap = (x: any):FFLogsBossParse => {
    return {
        boss: x["encounter"]["name"],
        rankPercent: x["rankPercent"],
        medianPercent: x["medianPercent"],
        kills: x["totalKills"],
        job: x["spec"],
        rank: x["allStars"] ? x["allStars"]["rank"] : null
    }
  }
  return {
    savage: savage.map(encounterMap),
    ultimates: ultimates.map(encounterMap)
  }
}

const FFLogs = () => {
  let token = getToken();
  return {
    refreshToken: () => token = getToken(),
    retrieveRanking: async (charName: string, server: string, region: string): Promise<FFLogsResponse> => {
      const q = {query: `query {characterData{character(name: "${charName}"serverSlug: "${server}"serverRegion: "${region}"){hidden Zone${SAVAGE_ZONE_ID}diff101: zoneRankings(zoneID: ${SAVAGE_ZONE_ID}, difficulty: 101, metric: rdps, timeframe: Historical)Zone43diff100: zoneRankings(zoneID: 43, difficulty: 100, metric: rdps, timeframe: Historical)Zone45diff100: zoneRankings(zoneID: 45, difficulty: 100, metric: rdps, timeframe: Historical)Zone53diff100: zoneRankings(zoneID: 53, difficulty: 100, metric: rdps, timeframe: Historical)Zone50diff100: zoneRankings(zoneID: 50, difficulty: 100, metric: rdps, timeframe: Historical)Zone55diff100: zoneRankings(zoneID: 55, difficulty: 100, metric: rdps, timeframe: Historical)Zone65diff100: zoneRankings(zoneID: 65, difficulty: 100, metric: rdps, timeframe: Historical)}}}`}
      let t = await token;
      // check if token has expired and renew if needed
      if(new Date() > t.expires){
        token = getToken();
        t = await token;
      }
      console.log(`Looking up logs for ${charName} ${server} ${region}`)
      const req = await fetch(FF_LOGS_BASE_API_URI, {
        method: "POST",
        next: {
          revalidate: 600
        },
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${t.access_token}`
        },
        body: JSON.stringify(q)
      })
      return minifyOutput(await req.json());

    },
    combineRankings: (...logs: FFLogsResponse[]):FFLogsResponse => {
      const merged: FFLogsResponse = {
        savage: [],
        ultimates: [],
      }
      const merger = (parse: FFLogsBossParse, key: keyof FFLogsResponse) => {
        const existing = merged[key].find(s => s.boss === parse.boss)
        if(existing){
          existing.kills += parse.kills;
          if(parse.rankPercent > existing.rankPercent){
            existing.rankPercent = parse.rankPercent;
            existing.medianPercent = parse.medianPercent;
            existing.job = parse.job;
            existing.rank = parse.rank;
          }
        }
        else{
          merged[key].push(parse);
        }
      }

      for(const log of logs){
        log.savage.forEach(l => merger(l, "savage"));
        log.ultimates.forEach(l => merger(l, "ultimates"))
      }
      return merged;
    } 
  } 
}

export default FFLogs(); 
