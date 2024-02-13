import * as React from 'react';
import Button from '../Button';

type FFLogToggleButtonsProps = {
  selected?: "combined" | "na" | "oc"
}

const FFLogToggleButtons = ({selected = "combined"}: FFLogToggleButtonsProps) => {
  
  return <div>
    <Button href="/logs/combined" selected={selected === "combined"}>Combined</Button>
    <Button href="/logs/na" selected={selected === "na"}>NA</Button>
    <Button href="/logs/oc" selected={selected === "oc"}>OCE</Button>
  </div>
}

export default FFLogToggleButtons;
