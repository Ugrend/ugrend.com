import * as React from 'react';
import styles from './NavBar.module.css'
import Discord from './Discord/Discord';
import FFLogsLink from './FFLogsLink';
import Link from 'next/link';

type NavBarProps = {
  showHome?: boolean;
  solidBackground?: string
}
const NavBar = ({showHome, solidBackground}: NavBarProps) => {
    const backgroundOverride = {backgroundColor: "inherit"};
    if(solidBackground){
      backgroundOverride.backgroundColor = solidBackground;
    }

    return <div className={styles.navBar} style={backgroundOverride}>
      {showHome && <Link href="/" className={styles.navBarLink}>Home</Link>}
      <FFLogsLink/>
      <Discord/>
      <Link href="/screenshots" className={styles.navBarLink}>ScreenShots</Link>
      <a target='_blank' href='https://pats.ugrend.com' className={styles.navBarLink}>Pats</a>  
      <a target='_blank' href='https://korelael.com' className={styles.navBarLink}>Art</a>  
    </div>
}

export default NavBar;
 
