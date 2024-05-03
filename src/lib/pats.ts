
import {EmoteCountSource, PrismaClient} from "@prisma/client";
import { refreshLodeStone } from "./FFPlayerLookup";


const client = new PrismaClient();


export const getPatsByPlayerName = async (playerName: string) => {

  const totalCount = await client.emoteCount.findMany({
    where: {
      PatPlayer: {
        name: playerName
      }
    },
    select: {
      emote: {
        select: {
          name: true
        }
      },
      PatPlayer: {
        select: {
          name: true,
          id: true,
          server: true 
        }
      },
      count: true

    }
  })
  console.log(totalCount);
  const countsSource = await client.emoteCountSource.findMany({
    where: {
      PatPlayer: {
        name: playerName
      }
    },
    select: {
      emote: {
        select: {
          name: true
        }
      },
      PatPlayer: {
        select: {
          name: true,
          id: true,
          server: true
        }
      },
      SourcePlayer: true,
      count: true
    }
  })
  const refreshCache: {[key: string]: any} = {};
  const byPlayer: {[key: string]: {emote: {name: string}, PatPlayer: {name: string, id: number, server: string}, SourcePlayer: {name: string, id: number, server: string, loadstone_id: number, avatar_uri: string}, count: number}[]} = {}
  for(let emote of countsSource){
    if(byPlayer[emote.SourcePlayer.name] == null){
      byPlayer[emote.SourcePlayer.name] = []
    }
    if(emote.SourcePlayer.avatar_uri == null || emote.SourcePlayer.avatar_uri === ""){
      const key = emote.SourcePlayer.name + emote.SourcePlayer.server;
      if(refreshCache[key]){
        emote.SourcePlayer = Object.assign({},refreshCache[key])
      }
      else{
        const refreshed = await refreshLodeStone(emote.SourcePlayer.name, emote.SourcePlayer.server) ?? emote.SourcePlayer;
        refreshCache[key] = refreshed
        emote.SourcePlayer = refreshed
      }
   }
    byPlayer[emote.SourcePlayer.name].push(emote)
  }


  return {totalCount, byPlayer}


}
