"use client"
import fetcher from '@/lib/utils';
import { PlayerData } from '@/types';
import * as React from 'react';
import styles from './PlayerLocation.module.css';
import useSWR from 'swr';

const PlayerLocation = () => {
  const {data, isLoading} = useSWR<PlayerData|null>("/api/player", fetcher, {refreshInterval: 5000})
  if(isLoading){
    return <div>Current Location: Offline</div>
  }
  let percentage = "0";
  if(data?.CombatInfo){
    percentage = (100 - ((data.CombatInfo.MaxHp - data.CombatInfo.CurrentHP) / data.CombatInfo.MaxHp) * 100).toFixed(1);
  }
  if(data == null || data.Name === "Unknown"){
    return <div>
      Current Location: Offline
    </div>
  } 

  return (
    <div className={styles.footer}>
      Current Location: {data?.Name} ({data?.HomeServer}), {data?.Location} ({data?.CurrentServer}). {!!data?.CombatInfo?.Name && <>Currently Fighting: {data.CombatInfo.Name} ({percentage}%)</>}
    </div>
  )
}

export default PlayerLocation
