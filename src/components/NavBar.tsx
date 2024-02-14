import * as React from 'react';
import styles from './NavBar.module.css'
import Discord from './Discord/Discord';
const NavBar = () => {
    return <div className={styles.navBar}>
      <a href='https://www.fflogs.com/character/na/brynhildr/ugrend%20starlight' className={styles.navBarLink}>FFLogs</a>  
      <Discord/>
      <a href='/' className={styles.navBarLink}>ScreenShots</a>  
      <a href='https://pats.ugrend.com' className={styles.navBarLink}>Pats</a>  
      <a href='https://korelael.com' className={styles.navBarLink}>Art</a>  
    </div>
}

export default NavBar;
 
