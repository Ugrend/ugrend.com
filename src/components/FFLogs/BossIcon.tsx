import * as React from 'react';
import Image from 'next/image';
import styles from './JobIcon.module.css';
const BossIcon = ({boss}: {boss: string}) => {
  const sourceMap: {[k: string]: string} = {
    "Kokytos": "/imgs/bosses/P9S.png",
    "Pandaemonium": "/imgs/bosses/P10S.png",
    "Themis": "/imgs/bosses/P11S.png",
    "Athena": "/imgs/bosses/P12S_1.png",
    "Pallas Athena": "/imgs/bosses/P12S_2.png",
    "The Unending Coil of Bahamut": "/imgs/bosses/UCOB.png",
    "The Weapon's Refrain": "/imgs/bosses/UWU.png",
    "The Epic of Alexander": "/imgs/bosses/TEA.png",
    "The Omega Protocol": "/imgs/bosses/TOP.png",
    "Dragonsong's Reprise": "/imgs/bosses/DSR.png"
  }

  return <Image className={styles.jobIcon} height={20} width={20} src={sourceMap[boss]} alt={boss}/>
}

export default BossIcon;
