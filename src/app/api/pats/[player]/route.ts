import { NextRequest, NextResponse } from "next/server";  
import { getPatsByPlayerName } from "@/lib/pats";

export async function GET(request: NextRequest, {params}: {params:{player: string}}){
  const result = await getPatsByPlayerName(params.player);
  return NextResponse.json(result, {status:200})

}
