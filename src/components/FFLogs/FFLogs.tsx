import * as React from 'react';
import FFLogToggleButtons from './FFlogToggleButtons';
import styles from './FFLogs.module.css';
import FFLogsTable from './FFLogsTable';

type FFlogsProps = {
  region: "combined" | "na" | "oc"
}

const FFLogs = ({region}: FFlogsProps) => {
  return <div className={styles.fflogs}>
    <FFLogToggleButtons selected={region}/> 
    <FFLogsTable region={region}/>
  </div>
}
export default FFLogs;
