"use client";
import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tooltip from '@radix-ui/react-tooltip';
import styles from './Discord.module.css'
import { relative } from 'path';

const Discord = () => {
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
    return (
    <>
      <a onClick={() => setModalOpen(true)} className={styles.navBarLink} >Discord</a>
      <Dialog.Root open={modalOpen} onOpenChange={(b)=>setModalOpen(b)}>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.DialogOverlay}/>
        </Dialog.Portal>
        <Dialog.Content className={styles.DialogContent} style={{zIndex: 20}}>
          <div className={styles.DiscordBanner}>
            <Tooltip.Provider delayDuration={100}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <a href="discord://https://discordapp.com/users/203516758802300928"><img height="25px" width="25px" src="/imgs/logos/discord-mark-blue.png" /></a>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content className={styles.TooltipContent}>
                    Open on Discord
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
          <div className={styles.DiscordContent}>
            <img className={styles.DiscordProfilePicture} src="/imgs/discord_profile.png"/>
            <div className={`${styles.DiscordStatus} ${styles.DiscordStatusOnline}`}></div>
            <Tooltip.Provider delayDuration={100}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <div className={styles.DiscordBadge}>
                    <img className={styles.DiscordBadgeIcon} src="/imgs/discord_badge_old_user.png"/> 
                  </div>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content className={styles.TooltipContent}>
                    Originally known as <br/> Ugrend#4719
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
          <div className={styles.DiscordUserInfo}>
              <div className={styles.DiscordDisplayName}>Ugrend</div>
              <div className={styles.DiscordUserName}>ugrend</div>
              <div className={styles.Divider}></div>
              <div className={styles.DiscordAboutHeader}>About Me</div>
              <div className={styles.DiscordAboutMeContent}><a href="https://ugrend.com">https://ugrend.com</a></div>
              <div className={styles.DiscordAboutHeader}>Discord Member Since</div>
              <div className={styles.DiscordAboutMeContent}>Jul 16, 2016</div>
              <div className={styles.Divider}></div>
              <div className={styles.Connections}>
                <a href="https://github.com/ugrend" target="_blank"><img src="/imgs/logos/github.svg"/></a>
                <a href="https://steamcommunity.com/id/ugrend/" target="_blank"><img src="/imgs/logos/steam.svg"/></a>
                <a href="https://twitch.tv/ugrend/" target="_blank"><img src="/imgs/logos/twitch.svg"/></a>
                <a href="https://youtube.com/ugrend/" target="_blank"><img src="/imgs/logos/youtube.svg"/></a>
                <a href="discord://https://discordapp.com/users/203516758802300928"><img src="/imgs/logos/discord-mark-blue.png"/></a>
              </div>
          </div>

        </Dialog.Content>
      </Dialog.Root>
    </>
  )

}
export default Discord;
