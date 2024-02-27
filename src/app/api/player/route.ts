import PlayerTracker from "@/lib/PlayerTracker";
import { PlayerData } from "@/types";
import { NextRequest, NextResponse } from "next/server";
const PLAYER_TRACK_API_KEY = process.env.PLAYER_TRACK_API_KEY;


export async function POST(request: NextRequest){
  
  const apiKey = request.nextUrl.searchParams.get("api");
  // prevent randoms publishing data
  if(apiKey !== PLAYER_TRACK_API_KEY){
    return new NextResponse(null, {status: 200})
  }
  const playerData:PlayerData = await request.json();
  PlayerTracker.updateStats(playerData);
  return new NextResponse(null, {status: 200})
}

export async function GET(){
  return NextResponse.json(PlayerTracker.getStats(), {status: 200});
}
