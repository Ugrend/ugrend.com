import NavBar from '@/components/NavBar';
import * as React from 'react';
import styles from './page.module.css';
import Screenshot from '@/components/Screenshots/Screenshot';

const ScreenShotsPage = () => {
  return <div>
    <div className={styles.mainFlexBox}>
      <div>
        <Screenshot src="/imgs/screenshots/UCOB.jpg">
          <div>
            <b>UCOB</b> - Cleared 08/01/23 <br/>
            Players: Cynthia Bastet, Yuumi Meow, Koko Aoi, Olgierd Everec, Hedgehog&apos;s Dillemma, Shamb Molkot, Aaze Astraea 
          </div>
        </Screenshot>
        <Screenshot src="/imgs/screenshots/TOP.jpg">
          <div>
            <b>TOP</b> - Cleared 08/04/23 <br/>
            Players: Cynthia Bastet, Yuumi Meow, Maca Roni, Dawn Vhalavri, Eloria Rose, Aaze Astraea, Cookie Chance
          </div>
        </Screenshot>
        <Screenshot src="/imgs/screenshots/TEA.jpg">
          <div>
             <b>TEA</b> - Cleared 20/12/23 <br/>
            Players: Ely Dorne, Artemis Moonstalker, Dins Fway, Koko Aoi, Kigga Quah, Myriel Aliapoh, Yae Miho
          </div>
        </Screenshot>
        <Screenshot src="/imgs/screenshots/UWU.jpg">
          <div>
            <b>UWU</b> - Cleared 06/01/24 <br/>
            Players: Fei Lindenblatt, Flita Bahond, Rael Najdorf, Sraphim Windrunner, Luvese Lauriant, Rainu Altea, Gilly Boffingtop
          </div>
        </Screenshot>
        <div style={{marginTop: "50px"}}></div>
      </div>
    </div>


    <div className={styles.footer}>
      <NavBar showHome={true} solidBackground='#F8C8DC'/>
    </div>
  </div>
}

export default ScreenShotsPage;
