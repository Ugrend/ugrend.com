import * as React from 'react';
import styles from './AboutMe.module.css';
import FFLogs from './FFLogs/FFLogs';

const AboutMe = () => {

  return <div className={styles.aboutMeBody}>
    <h1>Ugrend Starlight</h1>
    <br/>
            <div id="content">
                <p>I like to raid on the critically acclaimed MMORPG Final Fantasy XIV. <br/>
                    I am not exactly good at this game.
                </p>

                <p>I currently play two characters:</p>
                <p><b>Ugrend Starlight on Brynhildr (NA) <br/>Ugrend Moonlight on Ravana (OCE)</b></p>
                <p>I main <b>SMN</b> because I like braindead class :3, <br/> However I also play <b>MCH, RPR, WAR </b> </p>
                <br/>
            </div>
    <br/>
  </div>
}

export default AboutMe;
