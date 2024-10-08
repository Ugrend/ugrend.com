import Link from 'next/link';
import * as React from 'react';
import navStyles from "../NavBar.module.css";
import { getPatsByPlayerName } from '@/lib/pats';
import styles from "./Pats.module.css"
import PatsTable from './PatsTable';
import { AvailablePatPlayers } from '@/types';
type PatsProps = {
  player: AvailablePatPlayers
}

const Pats = async ({player}: PatsProps) => {
  const style = {textDecoration: "underline"};
  const data = await getPatsByPlayerName(player) 
  data.totalCount.sort((a,b) => {
    if(a.emote.name === "pat")
      return -1
    if(a.emote.name === "dote" && b.emote.name !== "pat")
      return -1
    return 0
  })
  const rows = Object.keys(data.byPlayer).map(player =>{
    return { player: data.byPlayer[player][0].SourcePlayer, id: player, 
      pats: data.byPlayer[player].find(e => e.emote.name === "pat")?.count || 0,
      dotes: data.byPlayer[player].find(e => e.emote.name === "dote")?.count || 0,
      hugs: data.byPlayer[player].find(e => e.emote.name === "hug")?.count || 0,
      slaps: data.byPlayer[player].find(e => e.emote.name === "slap")?.count || 0,
    }
  })

  return <div>
   <div style={{display: "flex"}}>
      <Link className={navStyles.navBarLink} style={player === "Ugrend Starlight" ? style : undefined} href="/pats/Ugrend Starlight">Ugrend Starlight</Link>
      <Link className={navStyles.navBarLink} style={player === "Ugrend Moonlight" ? style : undefined} href="/pats/Ugrend Moonlight">Ugrend Moonlight</Link>
    </div>
    <h2>Totals:</h2>
    <div style={{display: "flex"}}>
      {data.totalCount.map(emote => {
        return <p key={emote.emote.name} className={styles.emoteCount}>{emote.emote.name}: {emote.count}</p>
      })}
    </div>
    <PatsTable rows={rows}/>

    </div>
}

export default Pats;
