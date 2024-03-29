import { NextRequest, NextResponse } from "next/server";  
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();


export async function GET(request: NextRequest, {params}: {params:{playerId: number}}){
  const player = params.playerId;
  const totalCount = await client.emoteCount.findMany({
    where: {
      pat_player_id: player
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
  const countsSource = await client.emoteCountSource.findMany({
    where: {
      pat_player_id: player
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
  const result = {totalCount, countsSource}


  
  return NextResponse.json(result, {status:200})


}
