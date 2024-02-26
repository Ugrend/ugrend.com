import Home from '@/app/page';
import AboutMe from '@/components/AboutMe';
import FFLogs from '@/components/FFLogs/FFLogs';
import MainContent from '@/components/MainContent';
import { Regions } from '@/types';
import * as React from 'react';


const DisplayRegionLogs = ({params}: {params: { region: Regions}}) => {
  const region = ["combined", "na", "oc"].includes(params.region) ? params.region : "combined";
  return (
    <MainContent>
      <div>
        <AboutMe/>
        <FFLogs region={region}/>
      </div>
    </MainContent>
  )
  
}
export default DisplayRegionLogs;
