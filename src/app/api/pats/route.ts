import { getPlayerByName } from "@/lib/FFPlayerLookup";
import { PatData } from "@/types";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import NotifcationHandler from "@/lib/NotifcationHandler";
const PLAYER_TRACK_API_KEY = process.env.PLAYER_TRACK_API_KEY;
const prisma = new PrismaClient();


class PatService{

  private timer: NodeJS.Timeout;
  private jobs: PatData[] = [];

  constructor(){
    this.timer = setInterval(()=>{
      const job = this.jobs.pop();
      if(job == null)
        return;
      this.processJob(job);
    }, 100);
  }

  addJob(job: PatData){
    this.jobs.push(job);
  }
  async processJob(job: PatData){
    const patPlayer = await getPlayerByName(job.PatPlayer, job.PatPlayerServer);
    const sourcePlayer = await getPlayerByName(job.SourcePlayer, job.SourcePlayerServer)
    if(patPlayer == null || sourcePlayer == null)
      return;

    const emote = await prisma.emote.upsert({
      where: {
        name: job.Emote
      },
      update: {},
      create: {
        name: job.Emote
      }
    })
    const totalCount = await prisma.emoteCount.upsert({
      where:{
        emotePlayerUniq:{
          emote_id: emote.id,
          pat_player_id: patPlayer.id
        }
      },
      update: {
        count: {
          increment: 1
        }
      },
      create: {
        emote_id: emote.id,
        pat_player_id: patPlayer.id,
        count: 1
      }
    })
    const sourceCount = await prisma.emoteCountSource.upsert({
      where:{
        sourcePlayerEmoteUniq: {
          emote_id: emote.id,
          source_player_id: sourcePlayer.id,
          pat_player_id: patPlayer.id
        }
      },
      update: {
        count: {
          increment: 1
        }
      },
      create:{
        emote_id: emote.id,
        source_player_id: sourcePlayer.id,
        pat_player_id: patPlayer.id,
        count: 1
      }
    });
    const auditEvent = await prisma.emoteAudit.create({
      data:{
        emote_id: emote.id,
        pat_player_id: patPlayer.id,
        source_player_id: sourcePlayer.id,
        location: job.Location
      }
    })
    NotifcationHandler.addNotification({
      id: auditEvent.id,
      player: patPlayer,
      emoter: sourcePlayer,
      emote: emote,
      location: job.Location,
      total_player: totalCount.count,
      total_emoter: sourceCount.count,
      date: new Date()
    })
  }
}
const patService = new PatService();


export async function POST(request: NextRequest){
  const apiKey = request.nextUrl.searchParams.get("api");
  if(apiKey !== PLAYER_TRACK_API_KEY){
    return new NextResponse(null, {status: 401});
  }
  const patdata: PatData = await request.json();
  patService.addJob(patdata);
  return new NextResponse(null, {status: 201})
}

export async function GET(){
  const patPlayers = await prisma.emoteCount.findMany({
    distinct: ['pat_player_id'],
    select: {
      PatPlayer: true
    }
  })
  return NextResponse.json(patPlayers, {status: 200});
}


