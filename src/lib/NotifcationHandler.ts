import { Emote, Player } from "@prisma/client";

export interface Notification {
  id: number;
  player: Player;
  emoter: Player;
  emote: Emote;
  location: string;
  total_player: number;
  total_emoter: number;
  date: Date;
}


class Notifcations {
  
  private notifications: Notification[] = [];

  public getNotifications(): Notification[]{
    this.notifications = this.notifications.filter(n => n.date > new Date( Date.now() - 1000 * 5 ))
    return this.notifications;
  }

  public addNotification(notification: Notification){
    this.notifications.push(notification);
  }
}

const NotifcationHandler = new Notifcations();
export default NotifcationHandler;
