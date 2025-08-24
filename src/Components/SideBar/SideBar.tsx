import { NavLink, useNavigate } from "react-router-dom";
import { Image } from "antd";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { logOut, useLoadingAvatar } from "../../Utils/http";
import style from "./SideBar.module.scss";
import { ConfigProvider, Switch, Layout } from "antd";
import Sider from "antd/es/layout/Sider";
import { useEffect, useState } from "react";
import { logos } from "../../UI/logo";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useAuthReady } from "../../Utils/useAuthChanged";
import { fetchName } from "../../store/nameAction";
import Modal from "../../UI/Modal";
const SideBar = () => {
  const [isDark, setIsDark] = useState(false);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const authReady = useAuthReady();
  const showAvatar = useLoadingAvatar();
  useEffect(() => {
    console.log("Dispatching fetchEmail and fetchName");
    if (authReady) {
      dispatch(fetchName());
    }
  }, [dispatch, authReady]);

  const { firstName, lastName } = useSelector((state: RootState) => state.name);
  const email = useSelector((state: RootState) => state.email);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setPhotoURL(user?.photoURL ?? null);
    });
    return () => unsub();
  }, []);
  const logout = logOut();
  const handleLogoutClick = () => {
    console.log("🔘 Logout clicked");
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      await logout.mutateAsync();
      navigate("/");
    } catch (err) {
      console.log("Try again, accur some problem with logout");
    }
    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };
  return (
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
        <Sider
          className={style.secondBar}
          style={{ width: "25vw", flex: "0 0 25vw", maxWidth: "25vw" }}
        >
          <div className={style.container}>
            <h2 className={isDark ? style.titleDark : style.title}>
              <Image
                src={isDark ? logos[0].image : logos[1].image}
                alt={isDark ? logos[0].alt : logos[1].alt}
                preview={false}
                className={style.mainLogoStyle}
              />
              Social
            </h2>
            <ul>
              <li>
                <NavLink
                  to="/friends"
                  className={`${isDark ? style.dark : style.light} ${
                    style.link
                  }`}
                >
                  {isDark ? (
                    <Image
                      src={logos[4].image}
                      alt={logos[4].alt}
                      preview={false}
                      className={style.logoStyle}
                    />
                  ) : (
                    <Image
                      src={logos[5].image}
                      alt={logos[5].alt}
                      preview={false}
                      className={style.logoStyle}
                    />
                  )}
                  Friends
                </NavLink>
              </li>
              <li>
                {" "}
                <NavLink
                  to="/profile"
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
                  My profile
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/main"
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
                  Main
                </NavLink>
              </li>
            </ul>
            <span className={isDark ? style.lineDark : style.line}></span>
            <ul>
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
                  Config
                </NavLink>
              </li>
              <li>
                <button
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
                  Logout
                </button>
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
                  <div>
                    <p>
                      {firstName} {lastName}
                    </p>
                    <p>{email}</p>
                  </div>
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
                {isDark ? (
                  <Image
                    src={logos[12].image}
                    alt={logos[12].alt}
                    preview={false}
                    width={15}
                    height={15}
                    className={style.logoStyle}
                  />
                ) : (
                  <Image
                    src={logos[11].image}
                    alt={logos[11].alt}
                    preview={false}
                    width={15}
                    height={15}
                    className={style.logoStyle}
                  />
                )}

                <Switch
                  checked={isDark}
                  className={style.custom_switch}
                  size="small"
                  onChange={(checked) => setIsDark(checked)}
                />
                {isDark ? (
                  <Image
                    src={logos[14].image}
                    alt={logos[14].alt}
                    width={15}
                    height={15}
                    preview={false}
                    className={style.logoStyle}
                  />
                ) : (
                  <Image
                    src={logos[13].image}
                    alt={logos[13].alt}
                    width={15}
                    height={15}
                    preview={false}
                    className={style.logoStyle}
                  />
                )}
              </ConfigProvider>
            </div>
          </div>
        </Sider>
      </Layout>

      {showLogoutModal && (
        <Modal onClose={cancelLogout}>
          <div className={style.modal}>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className={style.buttons} style={{}}>
              <button onClick={confirmLogout}>Logout</button>
              <button onClick={cancelLogout}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </ConfigProvider>
  );
};

export default SideBar;
