import MainContent from '@/components/MainContent';
import Pats from '@/components/Pats/Pats';
import PlayerTracker from '@/lib/PlayerTracker';
import * as React from 'react';
import styles from "./page.module.css"


const PatsPage = () => {
  const onlinePlayer = PlayerTracker.getStats();
  const imgSrc = onlinePlayer?.Name === "Ugrend Moonlight" ? "/imgs/pat_OCE.png" : "/imgs/pat_NA.png";
  return <MainContent>
    <img className={styles.patsImg} src={imgSrc}/>

    <div>
     <Pats player={onlinePlayer?.Name === "Ugrend Moonlight" ? "Ugrend Moonlight" : "Ugrend Starlight"}/> 
    </div>
  </MainContent>
}

export default PatsPage;
