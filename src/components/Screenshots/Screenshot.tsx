import * as React from 'react';
import styles from './Screenshot.module.css';
import Image from 'next/image';
import Link from 'next/link';

type ScreenshotProps = {
  src: string
  children: React.ReactNode;
}

const Screenshot = ({src, children}: ScreenshotProps) => {
  return <div className={styles.container}>
    <Link href={src} target="_blank">
      <Image src={src} alt={src} width={1280} height={720} quality={100} className={styles.screenshot} />
    </Link>
     <div>{children}</div>
  </div>
}

export default Screenshot;
