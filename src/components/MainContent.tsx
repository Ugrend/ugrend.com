import * as React from 'react';
import styles from "./MainContent.module.css";
import NavBar from './NavBar';
import PlayerLocation from './PlayerLocation';

type MainContentProps = {
  children: React.ReactNode;
}

const MainContent = ({children}: MainContentProps) => {
  return <>
    <div className={styles.mainFlexBox}>
    <div className={styles.mainBox}>
      {children}
      <div className={styles.profilePicture}></div> 
      <NavBar/>
    </div>  
  </div>
  <PlayerLocation/>
  </>;
}
export default MainContent;
