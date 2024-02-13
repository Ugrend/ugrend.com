import { FFLogsBossParse } from '@/lib/FFLogs';
import * as React from 'react';
import styles from './FFLogsTable.module.css'
import JobIcon from './JobIcon';
import ColourParse from './ColorParse';
import BossIcon from './BossIcon';

type FFLogsTableParseDataProps = {
  data: FFLogsBossParse[];
}

const FFLogsTableParseData = async ({data}: FFLogsTableParseDataProps) => {


  return (
    <>
      {data.filter(p => p.kills > 0).map(parse => {
        return <tr key={parse.boss}>
          <td style={{width: '60%'}}><BossIcon boss={parse.boss}/>{parse.boss}</td>
          <td className={styles.fflogsRow}>
            <JobIcon job={parse.job}/>
            <ColourParse parseNumber={Math.floor(parse.rankPercent)}/>
          </td>
          <td className={styles.fflogsRow}><ColourParse parseNumber={Math.floor(parse.medianPercent)}/></td>
          <td className={styles.fflogsRow}>{parse.kills}</td>
        </tr>
      })}
    </>
  )
}

export default FFLogsTableParseData;
