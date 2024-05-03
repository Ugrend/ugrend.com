import { NotifcationHandler } from "@/lib/NotifcationHandler";
import { NextResponse } from "next/server";


export async function GET(){
  return NextResponse.json(NotifcationHandler.getNotifications(), {status: 200});
}
