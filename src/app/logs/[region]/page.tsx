import Home from '@/app/page';
import { Regions } from '@/types';
import * as React from 'react';


const DisplayRegionLogs = ({params}: {params: { region: Regions}}) => {
  const region = ["combined", "na", "oc"].includes(params.region) ? params.region : "combined";
  return <Home region={region}/> 
}
export default DisplayRegionLogs;
