import { Player, PrismaClient } from "@prisma/client";
import * as cheerio from 'cheerio';
import { log } from "util";

const loadStoneIdRegex = /(\d+)/;

const prisma = new PrismaClient();

type LoadStoneInfoResult = {
  loadStoneId: number
  avatarUri: string
}


export const lookupLodestoneInfo = async (playerName: string, server: string): Promise<LoadStoneInfoResult | null> =>{

  const req = await fetch(`https://eu.finalfantasyxiv.com/lodestone/character/?q=${playerName}&worldname=${server}`)
  const text = await req.text();
  console.log(`https://eu.finalfantasyxiv.com/lodestone/character/?q=${playerName}&worldname=${server}`);
  const $ = cheerio.load(text);
  let loadstoneId: string|null|undefined = null;
  let avatarUri = "";
  try{
    const entry = $(".entry__link");
    loadstoneId = entry.attr("href");
    avatarUri = entry.find("img").attr("src") ?? "";

  }catch(e){
    return null;
  }
  if(loadstoneId == null)
    return null;
  const extracted = loadStoneIdRegex.exec(loadstoneId)
  if(extracted == null){
    return null;
  }
  return {
    loadStoneId: parseInt(extracted[1]),
    avatarUri: avatarUri
  }
}

export const refreshLodeStone = async (playerName: string, server: string) =>{
  console.log("refresh running ")
  const player = await prisma.player.findFirst({
    where: {
      name: playerName,
      server: server 
    }
  })
  const lodeStoneInfo = await lookupLodestoneInfo(playerName, server);
  if(lodeStoneInfo == null){
    return null;
  }
  const existingPlayer = await prisma.player.findFirst({
    where: {
      loadstone_id: lodeStoneInfo?.loadStoneId
    }
  })
  if(existingPlayer){
    return await prisma.player.update({
      where: {
        loadstone_id: lodeStoneInfo?.loadStoneId
      },
      data:{
        avatar_uri: lodeStoneInfo?.avatarUri,
        name: playerName,
        server: server
      },
      select:{
        id: true,
        name: true,
        server: true,
        loadstone_id: true,
        avatar_uri: true
      }
    })
  }
  if(player == null){
    return null;
  }
  return await prisma.player.update({
    where: {
      id: player.id
    },
    data: {
      loadstone_id: lodeStoneInfo?.loadStoneId,
      avatar_uri: lodeStoneInfo?.avatarUri
    },
    select: {
      id: true,
      name: true,
      server: true,
      loadstone_id: true,
      avatar_uri: true
    }
  })
}

export const getPlayerByName = async (playerName: string, server: string ): Promise<Player|null> => {
  const player =  await prisma.player.findFirst({
    where: {
      name: playerName,
      server: server
    }
  });
  if(player){
    return player; 
  }
  const loadStoneInfo = await lookupLodestoneInfo(playerName, server);
  if(loadStoneInfo == null){
    return null;
  }
  const existingPlayer = await prisma.player.findFirst({
    where:{
      loadstone_id: loadStoneInfo.loadStoneId
    }
  })
  if(existingPlayer){
    return await refreshLodeStone(playerName, server)
  }
  const createdPlayer = await prisma.player.create({
    data: {
      name: playerName,
      server: server,
      loadstone_id: loadStoneInfo.loadStoneId,
      avatar_uri: loadStoneInfo.avatarUri
    }
  })
  return createdPlayer;
}
