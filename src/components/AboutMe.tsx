"use client";
import * as React from 'react';
import styles from './AboutMe.module.css';

const AboutMe = () => {
  const [currentPlayer, setCurrentPlayer] = React.useState<string>("")
  React.useEffect(() => {
    const socket = new WebSocket("ws://127.0.0.1:10501/ws")
    socket.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      if(data["combatants"]){
        setCurrentPlayer(data["combatants"][0].Name)
      }
    })
    setTimeout(()=>{
      socket.send(JSON.stringify({"call": "getCombatants"})); 
    }, 1000)
  }, [])
  return <div className={styles.aboutMeBody}>
    <h1>Ugrend Starlight</h1>
    <br/>
            <div id="content">
                {currentPlayer != "" && <p>Hello {currentPlayer}! :3</p>}
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
