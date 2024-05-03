import MainContent from "@/components/MainContent";
import Pats from "@/components/Pats/Pats";
import { AvailablePatPlayers } from "@/types";
import styles from "../page.module.css"

const PatsPlayerPage = ({params}: {params: {player: AvailablePatPlayers}}) =>{
  const player = params.player.replace("%20", " ") as AvailablePatPlayers;
  const imgSrc = player === "Ugrend Moonlight" ? "/imgs/pat_OCE.png" : "/imgs/pat_NA.png";
  return <MainContent>
    <img className={styles.patsImg} src={imgSrc}/>
    <div>
      <Pats player={player}/>
    </div>
  </MainContent>


}
export default PatsPlayerPage;
