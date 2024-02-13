import * as React from 'react';
import styles from './Button.module.css';
import Link from 'next/link';

type ButtonProps = {
  selected?: boolean
  children?: React.ReactNode;
  href: string;
}

const Button = ({href, selected, children}: ButtonProps) => {
  const style = selected ? `${styles.button} ${styles.buttonSelected}` : styles.button;
  return <Link href={href}><button className={style}>{children}</button></Link>
}

export default Button;
