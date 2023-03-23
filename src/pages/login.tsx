import Button from "@/components/shared/Button";
import Head from "@/components/shared/Head";
import { REVALIDATE_TIME } from "@/constants";
import useSignIn from "@/hooks/useSignIn";
/* import quotes from "@/quotes.json"; */
import wallpapers from "@/wallpapers.json";
import { randomElement } from "@/utils";
import { Provider } from "@supabase/gotrue-js";
import axios from "axios";
import { GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { FaDiscord } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { isMobile } from "react-device-detect";
import BaseLayout from "@/components/layouts/BaseLayout";

interface Quote {
  anime: string;
  character: string;
  quote: string;
}

interface Wallpaper {
  name: string;
  url: string;
}

interface LoginPageProps {
  quotes: Quote[];
  wallpapers: Wallpaper[];
}

const isDev = process.env.NODE_ENV === "development";

const LoginPage: NextPage<LoginPageProps> = ({ quotes, wallpapers }) => {
  /* const randomQuote = useMemo(() => randomElement(quotes), [quotes]); */
  const randomLiveWallpaper = useMemo(() => randomElement(wallpapers), [wallpapers]);

  const { t } = useTranslation("login");

  const { query } = useRouter();

  const { redirectedFrom = "/" } = query as { redirectedFrom: string };

  const signInMutation = useSignIn({
    redirectTo: isDev
      ? `http://localhost:3000${redirectedFrom}`
      : redirectedFrom,
  });

  const handleSignIn = (provider: Provider) => () => {
    signInMutation.mutate(provider);
  };

  return (
    <React.Fragment>
      <Head
        title={`${t("login_heading")} - AnimetTV`}
        description={t("login_description")}
      />

      <div className="w-full h-screen grid grid-cols-1"
      style={{
        backgroundImage: isMobile ? "url('/login-background.jpg')" : "none",
        backgroundPosition: "center center",
        backgroundSize: "cover",
        opacity: "0.9",
      }}
      >

      {isMobile ? ('') :
        (
          <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          style={{opacity: '0.50'}}
          >
            <source src={randomLiveWallpaper.url} type="video/mp4" />
          </video>
        )}


        <div className="relative col-span-3 xl:col-span-2 bg-background flex items-center justify-center bg-transparent">
          <div className="w-full px-4 md:px-0 md:w-1/3">
            <h1 className="text-5xl font-bold mb-8">{t("login_heading")}</h1>
            <div className="space-y-4">
              <Button
                className="shadow-lg relative bg-white text-black font-bold flex items-center justify-center w-full hover:!bg-opacity-90"
                LeftIcon={FcGoogle}
                iconClassName="absolute left-6"
                onClick={handleSignIn("google")}
              >
                <p>{t("login_with_google")}</p>
              </Button>
              <Button
                className=" shadow-lg relative bg-[#5865F2] !hover:bg-white/20 text-white font-bold flex items-center justify-center w-full hover:!bg-opacity-90"
                LeftIcon={FaDiscord}
                iconClassName="absolute left-6"
                onClick={handleSignIn("discord")}
              >
                <p>{t("login_with_discord")}</p>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

// @ts-ignore
LoginPage.getLayout = (children) => (
  <BaseLayout showFooter={false}>{children}</BaseLayout>
);


export const getStaticProps: GetStaticProps = async () => {
  try {
    /* const { data } = await axios.get("https://animechan.vercel.app/api/quotes"); */

    return {
      props: {
        /* quotes: data, */
        wallpapers: wallpapers
      },
      revalidate: REVALIDATE_TIME,
    };
  } catch (err) {
    return {
      props: {
        /* quotes, */
        wallpapers: wallpapers
      },
    };
  }
};

export default LoginPage;
