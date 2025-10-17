import SearchName from "./SearchName";
import TapButton from "../../UI/TapButton";
import Tabs from "./Tabs";
import ToList from "./ToList";
import style from "./mainFriendsElement.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useState } from "react";
import FriendsList from "./FriendsList";
import FromList from "./FromList";
export default function MainFriendsElement({ userId }: { userId: string }) {
  const [selectedList, setSelectedList] = useState<string>("friends");
  const isDark = useSelector((state: RootState) => state.theme.state);

  const handleSelect = (selectedButton: string) => {
    setSelectedList(selectedButton);
  };

  return (
    <>
      <div className={isDark ? style.bgDark : style.bg}>
        <div className={style.container}>
          <header className={style.header}>
            <SearchName className={style.search} />
          </header>
          <main className={style.mainSection}>
            <Tabs
              buttons={
                <>
                  <menu>
                    <TapButton
                      onClick={() => {
                        handleSelect("friends");
                      }}
                      className={selectedList === "friends" ? `${style.active}` : undefined}
                    >
                      Friends
                    </TapButton>
                    <TapButton
                      onClick={() => {
                        handleSelect("sended requests");
                      }}
                      className={selectedList === "sended requests" ? `${style.active}` : undefined}
                    >
                      Sended Requests
                    </TapButton>
                    <TapButton
                      onClick={() => {
                        handleSelect("Obtains Requests");
                      }}
                      className={selectedList === "Obtains Requests" ? `${style.active}` : undefined}
                      
                    >
                      Obtains Requests
                    </TapButton>
                  </menu>
                </>
              }
            >
              {selectedList === 'friends' ? <FriendsList userId = {userId}/> :
               selectedList === 'sended requests' ? <ToList /> :
               selectedList === 'Obtains Requests' ? <FromList userId={userId}/> : null}
            </Tabs>
          </main>
        </div>
      </div>
    </>
  );
}
