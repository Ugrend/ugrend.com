import { Regions } from '@/types';
import * as React from 'react';
import styles from './FFLogsTable.module.css';
import FFLogs, { FFLogsResponse } from '@/lib/FFLogs';
import FFLogsTableParseData from './FFLogsTableParseData';
type FFLogsTableProps = {
  region: Regions
}
const players = [
  {
    charName: "Ugrend Starlight",
    server: "brynhildr",
    region: "na"
  },
  {
    charName: "Ugrend Moonlight",
    server: "ravana",
    region: "oc"
  }
]


const FFLogsTable = async ({region}: FFLogsTableProps) => {
  const logs = FFLogs;
  let rankings:FFLogsResponse = {savage: [], ultimates: []} 
  if(region === "combined"){
    rankings = logs.combineRankings(...await Promise.all(players.map(p => logs.retrieveRanking(p.charName, p.server, p.region))))
  }else{
    const p = players.find(p => p.region === region)
    if(p)
      rankings = await logs.retrieveRanking(p.charName, p.server, p.region)
  }

  return <div>
    <table className={styles.fflogsTable}>
      <thead>
        <tr>
          <td style={{maxWidth: '99%'}}>Boss</td>
          <td className={styles.fflogsRow}>Best %</td>
          <td className={styles.fflogsRow}>Median %</td>
          <td className={styles.fflogsRow}>Kills</td>
        </tr>
      </thead>
      <tbody>
        <tr><td className={styles.emptyRow} colSpan={4}></td></tr>
        <FFLogsTableParseData data={rankings.savage} />
        <tr><td className={styles.emptyRow} colSpan={4}></td></tr>
        <tr><td className={styles.emptyRow} colSpan={4}></td></tr>
        <tr><td className={styles.emptyRow} colSpan={4}></td></tr>
        <tr><td className={styles.emptyRow} colSpan={4}></td></tr>
        <FFLogsTableParseData data={rankings.ultimates}/>
      </tbody>
    </table>
  </div>
}
export default FFLogsTable
