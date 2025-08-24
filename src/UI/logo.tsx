import mainLogoDark from "../assets/main-logoDark.png";
import mainLogoLight from "../assets/main-logo-light.png";
import MainPageLogoLight from "../assets/mainPage-logoLight.png";
import MainPageLogoDark from "../assets/mainPage-logoDark.png";
import FriendsLogoDark from "../assets/friends-logoDark.png";
import FriendsLogoLight from "../assets/friends-logoLight.png";
import ConfigLogoLight from "../assets/config-logoLight.png";
import ConfigLogoDark from "../assets/config-logoDark.png";
import ProfileLogoDark from "../assets/profile-logoDark.png";
import ProfileLogoLight from "../assets/profile-logoLight.png";
import SunDark from "../assets/icons8-sun-black.png";
import SunWhite from "../assets/icons8-sun-white.png";
import MoonDark from "../assets/icons8-moon-black.png";
import MoonWhite from "../assets/icons8-moon-white.png";
import logout from "../assets/logout.png";
interface Logo {
  image: string;
  alt: string;
}
export const logos: Logo[] = [
  { image: mainLogoDark, alt: "main logo" },
  { image: mainLogoLight, alt: "main logo" },
  { image: MainPageLogoDark, alt: "mainPage logo" },
  { image: MainPageLogoLight, alt: "mainPage logo" },
  { image: FriendsLogoDark, alt: "friends logo" },
  { image: FriendsLogoLight, alt: "friends logo" },
  { image: ConfigLogoDark, alt: "config logo" },
  { image: ConfigLogoLight, alt: "config logo" },
  { image: ProfileLogoDark, alt: "profile logo" },
  { image: ProfileLogoLight, alt: "profile logo" },
  { image: logout, alt: "logout logo" },
  { image: SunDark, alt: "sun" },
  { image: SunWhite, alt: "sun" },
  { image: MoonDark, alt: "moon" },
  { image: MoonWhite, alt: "moon" },
];
