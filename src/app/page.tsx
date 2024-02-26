import AboutMe from "@/components/AboutMe";
import FFLogs from "@/components/FFLogs/FFLogs";
import MainContent from "@/components/MainContent";


const Home = () => {
  return (
    <MainContent>
      <div>
        <AboutMe/>
        <FFLogs region={"combined"}/>
      </div>
    </MainContent>

 );
}

export default Home;

