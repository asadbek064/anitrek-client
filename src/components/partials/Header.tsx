import Button from "@/components/shared/Button";
import Drawer, { DrawerRef } from "@/components/shared/Drawer";
import HeaderProfile from "@/components/shared/HeaderProfile";
import Logo from "@/components/shared/Logo";
import NavItem from "@/components/shared/NavItem";
import { DISCORD_URL, KO_FI_URL } from "@/constants";
import { useUser } from "@supabase/auth-helpers-react";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ComponentType, useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { AiOutlineRead, AiOutlineSearch } from "react-icons/ai";
import { BiLogIn } from "react-icons/bi";
import { FaDiscord, FaDonate, FaGamepad, FaMusic } from "react-icons/fa";
import { GiGamepad, GiHamburgerMenu } from "react-icons/gi";
import { BsPlayFill } from "react-icons/bs";
import { MdFindInPage, MdHighQuality, MdOutlineLiveTv, MdOutlineVideogameAsset } from "react-icons/md";
import { RiMovie2Line } from "react-icons/ri";
import Notifications from "../features/notifications/Notifications";
import PWAInstallPrompt from "../features/pwa/PWAInstallPrompt";
import LanguageSwitcher from "../shared/LanguageSwitcher";
import Section from "../shared/Section";
import TextIcon, { IconProps } from "../shared/TextIcon";


interface _route {
  title: string;
  href: string;
  icon: ComponentType<IconProps>;
}
const routes: _route[] = [
  {
    title: "Watch",
    href: "/",
    icon: BsPlayFill
  },
  {
    title: "Read",
    href: "/manga",
    icon: AiOutlineRead
  },
  {
    title: "Scene Finder",
    href: "/scene-search",
    icon: MdFindInPage
  },
  {
    title: "A.I Upscaled",
    href: "/ai-upscale",
    icon: MdHighQuality,
  },
  /* {
    title: "Trivia",
    href: "/trivia",
    icon: FaGamepad
  }, */
/*   {
    title: "Watch2together",
    href: "/wwf",
    icon: MdOutlineLiveTv
  }, */
  {
    title: "Clips",
    href: "/themes",
    icon: RiMovie2Line
  },
];

const Header = () => {
  const [isTop, setIsTop] = useState(true);
  const drawerRef = useRef<DrawerRef>();
  const { user } = useUser();
  const router = useRouter();
  const { t } = useTranslation("header");

  // rename header if not logged in
  console.log(user);
  
  if (user === null) {
    routes[0].title = "Anime";
    routes[1].title=  "Manga";
  } else {
    routes[0].title = "Watch";
    routes[1].title=  "Read";
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY === 0);
    };

    document.addEventListener("scroll", handleScroll);
  }, []);

  const searchUrl = router.asPath.includes("manga")
    ? "/browse?type=manga"
    : "/browse?type=anime";

  return (
    <Section
      className={classNames(
        "px-4 md:px-12 flex items-center h-16 fixed top w-full z-50 transition duration-200",
        !isTop
          ? "bg-background"
          : "bg-gradient-to-b from-black/88 via-black/30 to-transparent"
      )}
    >
      <Drawer
        ref={drawerRef}
        containerClassName="md:hidden mr-4"
        className="flex justify-between flex-col py-8"
        aria-label="Menu lable"
        button={<GiHamburgerMenu className="w-6 h-6" />}
      >
        <div>
          <Logo />

          <div className="space-y-3">
            {routes.map((route) => (
              <div onClick={drawerRef.current?.close} key={route.href}>
                <NavItem className="block" href={route.href}>
                  {({ isActive }) => (
                    <div className="flex flex-row pl-2 py-1.5">
                      <TextIcon
                      iconClassName="py-0.5"
                      LeftIcon={route.icon}
                    ></TextIcon>
                      <p
                        className={classNames(
                          "pl-3 border-l-4 font-semibold text-2xl",
                          isActive
                            ? "border-primary-500 text-white"
                            : "border-background-900 text-typography-secondary"
                        )}
                      >
                        {t(route.title)}
                      </p>
                    </div>
                  )}
                </NavItem>
              </div>
            ))}

            {user ? '': (
              <Link href={`/login?redirectedFrom=${router.asPath}`}>
              <a>
                
                <Button secondary className="mt-10">
                  <TextIcon  LeftIcon={BiLogIn}></TextIcon>
                  <p className="line-clamp-1 text-3xl font-semibold">{t("login")}</p>
                </Button>
              </a>
            </Link>
            )}
          </div>
        </div>

        <div className="px-4 space-y-4">
          <div className="flex items-center justify-center space-x-8">
            <ContactItem href={DISCORD_URL} Icon={FaDiscord} />
            <ContactItem href={KO_FI_URL} Icon={FaDonate} />
          </div>

          <p className="text-xs flex justify-center">Verison: 3.0.0</p>
        </div>
      </Drawer>

      <div className="relative h-2/3  mr-8">
        <NavItem href="/">{() => <Logo className="!w-full !h-full" />}</NavItem>
      </div>

      <div className="hidden md:flex items-center md:space-x-4 xl:space-x-8 md:text-sm lg:text-lg font-semibold text-typography-secondary">
        {routes.map((route) => (
          <NavItem href={route.href} key={route.href}>
            {({ isActive }) => (
              <div className="flex flex-row gap-x-2 place-items-center">
                <TextIcon
                  iconClassName="py-0.5 hidden lg:block"
                  LeftIcon={route.icon}
                ></TextIcon>
                <p
                  className={classNames(
                    "hover:text-white transition duration-200",
                    isActive && "text-primary-300"
                  )}
                >
                  {t(route.title)}
                </p>
              </div>
            )}
          </NavItem>
        ))}
      </div>

      <div className="flex items-center space-x-4 ml-auto">
        <Notifications />

        <NavItem href={searchUrl} aria-label="search button">
          {({ isActive }) => (
            <AiOutlineSearch
              className={classNames(
                "w-7 h-7 font-semibold hover:text-primary-500 transition duration-200",
                isActive && "text-primary-300"
              )}
            />
          )}
        </NavItem>
        {/* <div className="hidden 2xl:block">
          <LanguageSwitcher/>
        </div> */}
        
        {user ? (
          <HeaderProfile />
        ) : (
          <div>
              { !isMobile ? 
                <div className="flex items-center space-x-2">
                <Link href={`/login?redirectedFrom=${router.asPath}`}>
                  <a>
                    <Button primary>
                      <p className="line-clamp-1">{t("login")}</p>
                    </Button>
                  </a>
                </Link>
              </div>
               : ''}
          </div>
        )}
      </div>
    </Section>
  );
};

const ContactItem: React.FC<{
  Icon: React.ComponentType<any>;
  href: string;
}> = ({ Icon, href }) => {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      <Icon className="w-6 h-6 hover:text-primary-300 transition duration-200" />
    </a>
  );
};

export default React.memo(Header);
