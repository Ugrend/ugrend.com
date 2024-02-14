import * as React from 'react';
import styles from './NavBar.module.css'
import Discord from './Discord/Discord';
import FFLogsLink from './FFLogsLink';
const NavBar = () => {
    return <div className={styles.navBar}>
      <FFLogsLink/>
      <Discord/>
      <a target='_blank' href='https://pats.ugrend.com' className={styles.navBarLink}>Pats</a>  
      <a target='_blank' href='https://korelael.com' className={styles.navBarLink}>Art</a>  
    </div>
}

export default NavBar;
 
