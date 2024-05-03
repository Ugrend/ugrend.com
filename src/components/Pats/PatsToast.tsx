import { Notification } from "@/lib/NotifcationHandler";
import fetcher from "@/lib/utils";
import { useRouter } from "next/navigation";
import React from "react";
import {toast} from "react-toastify";
import useSWR from "swr";

const PatsToast = () => {
  const {data} = useSWR<Notification[]>("/api/notifications", fetcher, {refreshInterval: 2000})
  const router = useRouter();
  if(data){
    data.forEach(notifcation => {
      toast(<>
        <img src={notifcation.emoter.avatar_uri} height={50} width={50} style={{borderRadius: "10px"}}/>
        <p>{notifcation.emoter.name} just {notifcation.emote.name}ed {notifcation.player.name} in {notifcation.location}</p>
        <div>Bringing the total to: {notifcation.total_player}</div>
        <div>{notifcation.emoter.name} has {notifcation.emote.name}ed {notifcation.player.name} {notifcation.total_emoter} times!</div>
      </>,{
        toastId: notifcation.id,
        autoClose: 5000
      })
    })
    if(data.length > 0){
      router.refresh();
    }
  }

  return <></>
}
export default PatsToast;
