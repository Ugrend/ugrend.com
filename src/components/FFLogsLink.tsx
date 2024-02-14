"use client"
import * as React from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import navBarStyles from './NavBar.module.css';
import styles from "./FFLogsLink.module.css";
const FFLogsLink = () => {
  return <NavigationMenu.Root className={navBarStyles.navBarLink}>
      <NavigationMenu.Item className={styles.MenuItem}>
        <NavigationMenu.Content className={styles.MenuContent}>
          <a target="_blank" href="https://www.fflogs.com/character/na/brynhildr/ugrend%20starlight">
          <div className={styles.FFLogsChar}>
            <img src="/imgs/fflogs_na_avatar.jpg" />
              <div>
                <p>Ugrend Starlight</p>
                <p className={styles.FFLogsServerLoc}>Brynhildr (NA)</p>
            </div>
          </div>
          </a> 
        <div className={styles.Divider}></div>
          <a target="_blank" href="https://www.fflogs.com/character/na/brynhildr/ugrend%20starlight">
            <div className={styles.FFLogsChar}>
              <img src="/imgs/fflogs_oc_avatar.jpg" />
               <div>
                <p>Ugrend Moonlight</p>
                <p className={styles.FFLogsServerLoc}>Ravana (OC)</p>
              </div>
          </div>
          </a> 
        </NavigationMenu.Content>

        <NavigationMenu.Trigger className={styles.MenuItem}>
          <div>FFLogs</div> 
        </NavigationMenu.Trigger>
            </NavigationMenu.Item>
      <div className={styles.ViewportPosition}>
        <NavigationMenu.Viewport className={styles.NavigationMenuViewport} />
      </div>

  </NavigationMenu.Root>
}
export default FFLogsLink
