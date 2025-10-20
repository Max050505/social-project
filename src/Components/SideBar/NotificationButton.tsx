import { logos } from "../../UI/logo";
import { Image, Badge } from "antd";
import style from "./NotificationButton.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useState } from "react";
import NotificationService from "../../Utils/notificationService";

export default function NotificationButton() {
    const isDark = useSelector((state: RootState) => state.theme.state);
    const [notificationCount, setNotificationCount] = useState(0); 

    const showTestNotification = () => {

        if (notificationCount === 0) {
            NotificationService.info({
                message: 'No New Notifications',
                description: 'You are all caught up!',
                duration: 2,
            });
            return;
        }

        // Example of different notification types
        const notifications = [
            () => NotificationService.info({
                message: 'New Friend Request',
                description: 'John Doe sent you a friend request',
                onClick: () => setNotificationCount(prev => Math.max(0, prev - 1))
            }),
            () => NotificationService.success({
                message: 'Post Liked',
                description: 'Your post received a new like',
                onClick: () => setNotificationCount(prev => Math.max(0, prev - 1))
            }),
            () => NotificationService.warning({
                message: 'Storage Warning',
                description: 'You are running low on storage space',
                onClick: () => setNotificationCount(prev => Math.max(0, prev - 1))
            }),
        ];

        const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
        randomNotification();
    };

    return (
        <div className={style.notificationButton}>
            <Badge count={notificationCount} size="small">
                <button onClick={showTestNotification}>
                    <Image 
                        src={isDark ? logos[16].image : logos[15].image} 
                        alt={isDark ? logos[16].alt : logos[15].alt} 
                        className={style.logoStyle} 
                    />
                </button>
            </Badge>
        </div>
    );
}
