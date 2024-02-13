import AboutMe from "@/components/AboutMe";
import FFLogs from "@/components/FFLogs/FFLogs";
import MainContent from "@/components/MainContent";
import { Regions } from "@/types";


const Home = ({region = "combined"}: {region: Regions} ) => {
  return (
    <MainContent>
      <div>
        <AboutMe/>
        <FFLogs region={region}/>
      </div>
    </MainContent>

 );
}

export default Home;

