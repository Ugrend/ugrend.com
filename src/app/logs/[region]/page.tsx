import AboutMe from '@/components/AboutMe';
import FFLogs from '@/components/FFLogs/FFLogs';
import Home from '@/components/Home';
import MainContent from '@/components/MainContent';
import { Regions } from '@/types';
import * as React from 'react';


const DisplayRegionLogs = ({params}: {params: { region: Regions}}) => {
  const region = ["combined", "na", "oc"].includes(params.region) ? params.region : "combined";
  return <Home region={region}/>
}
export default DisplayRegionLogs;
