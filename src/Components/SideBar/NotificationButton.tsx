import { useNotificationApi } from "./Notification";
import { logos } from "../../UI/logo";
import { Image } from "antd";
import style from "./NotificationButton.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store";


export default function NotificationButton() {
    const api = useNotificationApi();

    const isDark = useSelector((state: RootState) => state.theme.state);

    return (
        <div className={style.notificationButton}>
            <button onClick={() => api.open({
                message: '-',
                duration: 2,
            })}><Image src={isDark ? logos[16].image : logos[15].image} alt={isDark ? logos[16].alt : logos[15].alt} className={style.logoStyle} /></button>
        </div>
    );
}
