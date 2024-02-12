import * as React from 'react';
import styles from './NavBar.module.css'
const NavBar = () => {
    return <div className={styles.navBar}>
      <a href='/' className={styles.navBarLink}>FFLogs</a>  
      <a href='/' className={styles.navBarLink}>Discord</a>  
      <a href='/' className={styles.navBarLink}>ScreenShots</a>  
      <a href='/' className={styles.navBarLink}>Pats</a>  
      <a href='/' className={styles.navBarLink}>Art</a>  
    </div>
}

export default NavBar;
 
