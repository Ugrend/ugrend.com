import * as React from 'react';

type ColourParseProps = {
  parseNumber: number;
}
const COLOR_GRADES = {
  ff100: "#e5cc80",
  ff99: "#e268a8",
  ff95: "#e268a8",
  ff75: "#a335ee",
  ff50: "#0070ff",
  ff25: "#1eff00",
  ff0: "#666666"
}

const ColourParse = ({parseNumber}: ColourParseProps) => {
  const getColor = (percentile: number) => {
    switch(true){
      case (percentile === 100):
        return COLOR_GRADES.ff100;
      case (percentile === 99):
        return COLOR_GRADES.ff99;
      case (percentile >= 95):
        return COLOR_GRADES.ff95;
      case (percentile >= 75):
        return COLOR_GRADES.ff75;
      case (percentile >= 50):
        return COLOR_GRADES.ff50;
      case (percentile >= 25):
        return COLOR_GRADES.ff25;
    }
    return COLOR_GRADES.ff0;
  }

  return <b style={{color: getColor(parseNumber)}}>{parseNumber}</b>
}
export default ColourParse;
