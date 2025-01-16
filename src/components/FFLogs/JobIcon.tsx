import * as React from 'react';
import Image from 'next/image';
import styles from './JobIcon.module.css';
import { Jobs } from '@/types';


const JobIcon = ({job}: {job: Jobs}) => {
  const sourceMap: {[k in Jobs]: string} = {
    "Warrior": "/imgs/jobs/WAR.png",
    "Gunbreaker": "/imgs/jobs/GNB.png",
    "Dark Knight": "/imgs/jobs/DRK.png",
    "Monk": "/imgs/jobs/MNK.png",
    "Samari": "/imgs/jobs/SAM.png",
    "Reaper": "/imgs/jobs/RPR.png",
    "Ninja": "/imgs/jobs/NIN.png",
    "White Mage": "/imgs/jobs/WHM.png",
    "Astrologian": "/imgs/jobs/AST.png",
    "Scholar": "/imgs/jobs/SCH.png",
    "Sage": "/imgs/jobs/SGE.png",
    "Black Mage": "/imgs/jobs/BLM.png",
    "Summoner": "/imgs/jobs/SMN.png",
    "Dancer": "/imgs/jobs/DNC.png",
    "Machinist": "/imgs/jobs/MCH.png",
    "Bard": "/imgs/jobs/BRD.png",
    "Pictomancer": "/imgs/jobs/PCT.png"
  }

  return <Image className={styles.jobIcon} height={20} width={20} src={sourceMap[job]} alt={job}/>
}
export default JobIcon;

