import Button from "@/components/shared/Button";
import Head from "@/components/shared/Head";
import { REVALIDATE_TIME } from "@/constants";
import useSignIn from "@/hooks/useSignIn";
import quotes from "@/quotes.json";
import { randomElement } from "@/utils";
import { Provider } from "@supabase/gotrue-js";
import axios from "axios";
import { GetStaticProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { FaDiscord } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

interface Quote {
  anime: string;
  character: string;
  quote: string;
}

interface LoginPageProps {
  quotes: Quote[];
}

const isDev = process.env.NODE_ENV === "development";

const LoginPage: NextPage<LoginPageProps> = ({ quotes }) => {
  const randomQuote = useMemo(() => randomElement(quotes), [quotes]);
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

      <div className="w-full h-screen grid grid-cols-1 md:grid-cols-5">
        <div className="col-span-3 bg-background flex items-center justify-center">
          <div className="w-full px-4 md:px-0 md:w-1/2">
            <h1 className="text-5xl font-bold mb-8">{t("login_heading")} TEST</h1>
            <div className="space-y-4">
            <form>
                  <div className="mb-6">
                    <input
                      type="text"
                      className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                      placeholder="Email address"
                    />
                  </div>

                  <div className="mb-6">
                    <input
                      type="password"
                      className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                      placeholder="Password"
                    />
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <a
                      href="#!"
                      className="text-blue-600 hover:text-blue-700 focus:text-blue-700 active:text-blue-800 duration-200 transition ease-in-out"
                    >
                      Forgot password?
                    </a>
                    <a
                      href="#!"
                      className="text-blue-600 hover:text-blue-700 focus:text-blue-700 active:text-blue-800 duration-200 transition ease-in-out"
                    >
                      Register
                    </a>
                  </div>

                  <button
                    type="submit"
                    className="inline-block px-7 py-3 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                  >
                    Sign in
                  </button>

                  <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
                    <p className="text-center font-semibold mx-4 mb-0">OR</p>
                  </div>
                </form>
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

        <div
          className="hidden md:block relative col-span-2 after:absolute after:inset-0 after:bg-background/70 after:z-10"
          style={{
            backgroundImage: "url('/login-background.jpg')",
            backgroundPosition: "center center",
            backgroundSize: "cover",
          }}
        >
          <div className="relative flex flex-col justify-center items-center w-full h-full z-20">
            <div className="w-full px-8">
              <p className="text-xl font-semibold text-white line-clamp-6">
                &quot;{randomQuote.quote}&quot;
              </p>
              <p className="text-right text-l italic mt-4 font-semibold">
                {randomQuote.character}
              </p>
              <p className="text-right text-xs font-medium text-gray-300">
                {randomQuote.anime}
              </p>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

// @ts-ignore
LoginPage.getLayout = (page) => page;

export const getStaticProps: GetStaticProps = async () => {
  try {
    const { data } = await axios.get("https://animechan.vercel.app/api/quotes");

    return {
      props: {
        quotes: data,
      },
      revalidate: REVALIDATE_TIME,
    };
  } catch (err) {
    return {
      props: {
        quotes,
      },
    };
  }
};

export default LoginPage;
