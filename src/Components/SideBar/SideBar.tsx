import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import {
  logOut,
  queryClient,
  useLoadingAvatar,
  fetchAvatarByUid,
} from "../../Utils/http";
import style from "./SideBar.module.scss";
import SideBarHiddenButton from "./SideBarHiddenButton";
import { ConfigProvider, Switch, Layout, Image } from "antd";
import { RightOutlined } from "@ant-design/icons";
import Sider from "antd/es/layout/Sider";
import { useEffect, useState } from "react";
import { logos } from "../../UI/logo";
import { useAuthReady } from "../../Utils/useAuthChanged";
import { fetchName } from "../../store/nameAction";
import Modal from "../../UI/Modal";
import {motion } from "framer-motion";
import type { LoaderFunctionArgs } from "react-router-dom";
import { setThemeState } from "../../store/themeSlice";

const SideBar = () => {
  const isDark = useSelector((state: RootState) => state.theme.state);
  const isStartPageActive = useSelector((state: RootState) => state.startPageState.isActive);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [hideSideBar, setHideSideBar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setHideSideBar(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const authReady = useAuthReady();
  const showAvatar = useLoadingAvatar();
  useEffect(() => {
    if (authReady) {
      dispatch(fetchName());
    }
  }, [dispatch, authReady]);


  function handleHideSideBar() {
    setHideSideBar((prev) => !prev);
  }
  const { firstName, lastName } = useSelector((state: RootState) => state.name);
  const email = useSelector((state: RootState) => state.email);
  

  const logout = logOut();
  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      await logout.mutateAsync();
      navigate('/main');
    } catch (err) {
      console.log("Try again, accur some problem with logout");
    }
    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };
  return (
    !isStartPageActive && (
      <ConfigProvider
        theme={{
          components: {
            Layout: {
              bodyBg: isDark ? "#1f1f1f" : "#f1f1f1",
              footerBg: isDark ? "#1f1f1f" : "#f1f1f1",
              headerBg: isDark ? "#1f1f1f" : "#f1f1f1",
              siderBg: isDark ? "#1f1f1f" : "#f1f1f1",
            },
          },
        }}
      >
        <Layout className={style.mainBar}>
          {isMobile && (
            <button 
              className={`${style.mobileMenuButton}`}
              onClick={() => setHideSideBar(!hideSideBar)}
            >
              {hideSideBar ? '☰' : '✕'}
            </button>
          )}
          
          <Sider
            className={`${style.secondBar} ${isMobile && !hideSideBar ? style.show : ''}`}
            collapsible
            collapsed={isMobile ? true : hideSideBar}
            collapsedWidth={72}
            trigger={null}
            style={{
              overflow: "hidden",
              transition: "all 0.3s ease",
              padding: 0,
            }}
          >
            <div className={style.wrap}>
              <SideBarHiddenButton
                className={`${isDark ? style.darkbutton : style.lightbutton} ${
                  style.sideBarHiddenButton
                } ${isMobile && style.hiddenButton}`}
                onClick={handleHideSideBar}
              >
                <motion.p
                  transition={{ type: "tween", duration: 0.3 }}
                  animate={{ rotate: hideSideBar ? 180 : 0 }}
                >
                  <RightOutlined />
                </motion.p>
              </SideBarHiddenButton>
            </div>
            <div className={`${style.container} ${(hideSideBar || isMobile) && style.center}`}>
              <h2 className={isDark ? style.titleDark : style.title}>
                <Image
                  src={isDark ? logos[0].image : logos[1].image}
                  alt={isDark ? logos[0].alt : logos[1].alt}
                  preview={false}
                  className={style.mainLogoStyle}
                />
                {(!hideSideBar && !isMobile) && "Social"}
              </h2>
              <ul className={`${(hideSideBar || isMobile) && style.center}`}>
                <li>
                  <NavLink
                    to="friends"
                    className={`${isDark ? style.dark : style.light} ${
                      style.link
                    }`}
                  >
                    {isDark ? (
                      <Image
                        src={logos[4].image}
                        alt={logos[4].alt}
                        preview={false}
                        className={`${style.logoStyle} `}
                      />
                    ) : (
                      <Image
                        src={logos[5].image}
                        alt={logos[5].alt}
                        preview={false}
                        className={style.logoStyle}
                      />
                    )}
                    {(!hideSideBar && !isMobile) && "Friends"}
                  </NavLink>
                </li>
                <li>
                  {" "}
                  <NavLink
                    to="profile"
                    className={`${isDark ? style.dark : style.light} ${
                      style.link
                    }`}
                  >
                    {isDark ? (
                      <Image
                        src={logos[8].image}
                        alt={logos[8].alt}
                        preview={false}
                        className={style.logoStyle}
                      />
                    ) : (
                      <Image
                        src={logos[9].image}
                        alt={logos[9].alt}
                        preview={false}
                        className={style.logoStyle}
                      />
                    )}
                    {(!hideSideBar && !isMobile) && "My profile"}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/story"
                    className={`${isDark ? style.dark : style.light} ${
                      style.link
                    }`}
                  >
                    {isDark ? (
                      <Image
                        src={logos[2].image}
                        alt={logos[2].alt}
                        preview={false}
                        className={style.logoStyle}
                      />
                    ) : (
                      <Image
                        src={logos[3].image}
                        alt={logos[3].alt}
                        preview={false}
                        className={style.logoStyle}
                      />
                    )}
                    {(!hideSideBar && !isMobile) && "Main"}
                  </NavLink>
                </li>
              </ul>
              <span className={isDark ? style.lineDark : style.line}></span>
              <ul className={`${(hideSideBar || isMobile) && style.center}`}>
                <li>
                  <NavLink
                    to="config"
                    className={`${isDark ? style.dark : style.light} ${
                      style.link
                    }`}
                  >
                    {isDark ? (
                      <Image
                        src={logos[6].image}
                        alt={logos[6].alt}
                        preview={false}
                        className={style.logoStyle}
                      />
                    ) : (
                      <Image
                        src={logos[7].image}
                        alt={logos[7].alt}
                        preview={false}
                        className={style.logoStyle}
                      />
                    )}
                    {(!hideSideBar && !isMobile) && "Config"}
                  </NavLink>
                </li>
                <li>
                  <div
                    className={`${isDark ? style.dark : style.light} ${
                      style.link
                    }`}
                    onClick={handleLogoutClick}
                  >
                    <Image
                      src={logos[10].image}
                      alt={logos[10].alt}
                      preview={false}
                      className={style.logoStyle}
                    />
                    {(!hideSideBar && !isMobile) && "Logout"}
                  </div>
                </li>
              </ul>

              <span className={isDark ? style.lineDark : style.line}></span>
              <ul>
                <li>
                  <NavLink
                    to="/profile"
                    className={`${isDark ? style.dark : style.light} ${
                      style.link
                    } ${style.person}`}
                  >
                    <Image
                      src={showAvatar.data ?? "avatar"}
                      alt="avatar"
                      preview={false}
                      width={60}
                      height={60}
                    />
                    {(!hideSideBar && !isMobile) && (
                      <div>
                        <p>
                          {firstName} {lastName}
                        </p>
                        <p>{email}</p>
                      </div>
                    )}
                  </NavLink>
                </li>
              </ul>
              <div className="sunMoon">
                <ConfigProvider
                  theme={{
                    components: {
                      Switch: {
                        handleBg: "#ffffff",
                        colorPrimary: "#515151",
                      },
                    },
                  }}
                >
                  {(!hideSideBar && !isMobile) && (
                    <Image
                      src={isDark ? logos[12].image : logos[11].image}
                      alt={isDark ? logos[12].alt : logos[11].alt}
                      preview={false}
                      width={15}
                      height={15}
                      className={style.logoStyle}
                      style={{paddingRight: '2px'}}
                    />
                  )}

                  <Switch
                    checked={isDark}
                    className={style.custom_switch}
                    size="small"
                    onChange={(checked) => dispatch(setThemeState(checked))}
                  />

                  {(!hideSideBar && !isMobile) && (
                    <Image
                      src={isDark ? logos[14].image : logos[13].image}
                      alt={isDark ? logos[14].alt : logos[13].alt}
                      width={15}
                      height={15}
                      preview={false}
                      className={style.logoStyle}
                      style={{paddingLeft: '2px'}}
                    />
                  )}
                </ConfigProvider>
              </div>
                
            </div>
          </Sider>
          
          {isMobile && !hideSideBar && (
            <div 
              className={style.mobileOverlay}
              onClick={() => setHideSideBar(true)}
            />
          )}
          
        </Layout>


          {showLogoutModal && (
            <Modal onClose={cancelLogout}>
              <div className={style.modal}>
                
                <h3>Confirm Logout </h3>
                <p>Are you sure you want to logout?</p>
                <div>
                  <button onClick={confirmLogout}>Logout</button>
                  <button onClick={cancelLogout}>Cancel</button>
                </div>
              </div>
            </Modal>
          )}
  
      </ConfigProvider>
    )
  );
};


export default SideBar;

export function loader({ params }: LoaderFunctionArgs) {
  const uid = params.user;
  if (!uid) return null;
  return queryClient.fetchQuery({
    queryKey: ["avatar", uid],
    queryFn: () => fetchAvatarByUid(uid),
  });
}

