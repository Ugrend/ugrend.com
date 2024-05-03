import * as React from 'react';
import MainContent from './MainContent';
import AboutMe from './AboutMe';
import FFLogs from './FFLogs/FFLogs';
import { Regions } from '@/types';
import styles from "./Home.module.css";

const Home = ({region}: {region: Regions}) => {
  return <MainContent>
    <div>
      <AboutMe/>
      <FFLogs region={region}/>
    </div>
    <div className={styles.profilePicture}/>
  </MainContent>
}
export default Home;
