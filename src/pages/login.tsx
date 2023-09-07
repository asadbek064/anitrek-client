import Button from "@/components/shared/Button";
import Head from "@/components/shared/Head";
import { REVALIDATE_TIME } from "@/constants";
import useSignIn from "@/hooks/useSignIn";
import wallpapers from "@/wallpapers.json";
import { randomElement } from "@/utils";
import { Provider } from "@supabase/gotrue-js";
import { GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { FaDiscord } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { isMobile } from "react-device-detect";
import BaseLayout from "@/components/layouts/BaseLayout";
import useSignInWithEmail from "@/hooks/useSignInEmail";
import Link from "next/link";
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
  wallpapers: Wallpaper[];
}

const isDev = process.env.NODE_ENV === "development";

const LoginPage: NextPage<LoginPageProps> = ({ wallpapers }) => {
  /* const randomQuote = useMemo(() => randomElement(quotes), [quotes]); */
  const randomLiveWallpaper = useMemo(() => randomElement(wallpapers), [wallpapers]);

  const { t } = useTranslation("login");

  const { query } = useRouter();

  const { redirectedFrom = "/" } = query as { redirectedFrom: string };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signInWithEmailMutation = useSignInWithEmail({ redirectTo: redirectedFrom });
  
  const signInMutation = useSignIn({
    redirectTo: isDev
      ? `http://localhost:3000${redirectedFrom}`
      : redirectedFrom,
  });

  const handleSignIn = (provider: Provider) => () => {
    signInMutation.mutate(provider);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signInWithEmailMutation.mutateAsync({ email, password });
    } catch (error) {
    }
  };

  return (
    <React.Fragment>
      <Head
        title={`${t("login_heading")} - AnimetTV`}
        description={t("login_description")}
      />

      <div className="w-full h-screen grid grid-cols-1">

      <div
        style={{
          backgroundImage: isMobile  ? "url('/login-background.jpg')" : "none",
          backgroundPosition: "center center",
          backgroundSize: "cover"
        }}
        className="absolute w-full h-screen"
      >
      </div>

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


        <div className="relative col-span-3 xl:col-span-2 bg-background-900/60 flex items-center justify-center">
          <div className="w-full px-4 md:px-0 md:w-full lg:w-1/2 mx-2">
            <h1 className="[font-size:var(--step-3)] font-bold mb-8">{t("login_heading")}</h1>
              <div className="flex items-center justify-center rounded-sm py-4 md:flex-row-reverse flex-col">
                <div className="py-5 md:py-0 md:px-4 w-full md:w-1/2 space-y-4 flex flex-col ease-in-out transition-all duration-75">
                    <Button
                      className="ease-in duration-75 rounded-sm shadow-lg relative bg-[#fcfcff] !hover:bg-white/20 text-neutral-800 font-bold flex items-center justify-center w-full py-4 hover:!bg-opacity-90"
                      LeftIcon={FcGoogle}
                      iconClassName=""
                      onClick={handleSignIn("google")}
                    >
                      <p className="tracking-wide">{t("login_with_google")}</p>
                    </Button>
                    <Button
                      className="ease-in duration-75 rounded-sm shadow-lg relative bg-[#5865F2] !hover:bg-white/20 text-white font-bold flex items-center justify-center w-full py-4  hover:!bg-opacity-90"
                      LeftIcon={FaDiscord}
                      iconClassName=""
                      onClick={handleSignIn("discord")}
                    >
                      <p className="tracking-wide ">{t("login_with_discord")}</p>
                    </Button>
                  </div>      

                <div className="bg-neutral-900/70 hover:bg-neutral-900/95 p-8 shadow-md w-full ease-in-out transition-all duration-100">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-white-100">
                        Email
                      </label>
                      <input
                        type="email"
                        className="tracking-wide text-lg mt-1 p-2 w-full border rounded-sm text-neutral-800 outline-0"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-white-100">
                        Password
                      </label>
                      <input
                        type="password"
                        className="text-lg mt-1 p-2 w-full border rounded-sm text-neutral-800 outline-0"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <button
                      type="submit"
                      className="ease-in duration-100 w-full bg-red-600 hover:bg-red-700 py-3 text-white rounded-sm"
                      disabled={signInWithEmailMutation.isLoading}
                    >
                      {signInWithEmailMutation.isLoading ? "Logging in..." : "Login In"}
                    </button>

                    <div className="flex flex-row justify-between my-2 py-2 [font-size:var(--step--1)]">
                       {/*  <Link
                          href={"/forgot-password"}
                        >
                        <a className="text-white hover:text-red-500 ease-in transition-all duration-75">Forgot password?</a>
                        </Link> */}
                      <Link
                          href={"/register"}
                        >
                          <a className="text-white hover:text-red-500 ease-in transition-all duration-75">Register</a>
                        </Link>
                    </div>

                  </form>
                </div>
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

    return {
      props: {
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


