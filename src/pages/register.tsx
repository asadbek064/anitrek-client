import useEmailRegister from "@/hooks/useEmailRegister";
import { randomElement } from "@/utils";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useMemo, useState } from "react";
import wallpapers from "@/wallpapers.json";
import { isMobile } from "react-device-detect";
import React from "react";
import Head from "@/components/shared/Head";
import BaseLayout from "@/components/layouts/BaseLayout";

interface RegisterPageProps {}

const RegisterPage: React.FC<RegisterPageProps> = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const registerMutation = useEmailRegister();
  const { t } = useTranslation("register");
  const randomLiveWallpaper = useMemo(() => randomElement(wallpapers), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerMutation.mutateAsync({ email, password });

    } catch (error) {}
  };

  return (

    <React.Fragment>
      <Head 
        title={`${t("register_heading")} - AnimetTV`}
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
          style={{opacity: '0.40'}}
          >
            <source src={randomLiveWallpaper.url} type="video/mp4" />
          </video>
        )}

        <div>
          <div className="mt-24 relative col-span-3 flex items-center justify-center ">
            <div className="px-2 md:px-2 flex justify-center flex-col w-full md:w-3/4 lg:w-2/5 ease-in-out duration-100 transition">
              <h1 className="[font-size:var(--step-3)] font-bold mb-8">
                {t("register_heading")}
              </h1>
              <div className="flex items-center justify-center rounded-sm flex-row-reverse w-full bg-neutral-900/70 hover:bg-neutral-900/95 p-6 md:p-12 shadow-md ease-in-out transition-all duration-100">
                <form onSubmit={handleSubmit} className="w-full">
                  <div className="mb-4">
                    <label className="block [font-size:var(--step--1)] font-medium text-white-100">
                      Email
                    </label>
                    <input
                      type="email"
                      className="[font-size:var(--step-0)] tracking-wide mt-1 p-2 w-full border rounded-sm text-neutral-800 outline-0"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block [font-size:var(--step--1)] font-medium text-white-100">
                      Password
                    </label>
                    <input
                      type="password"
                      className="[font-size:var(--step-0)] mt-1 p-2 w-full border rounded-sm text-neutral-800 outline-0"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="ease-in duration-100 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-sm"
                    disabled={registerMutation.isLoading}
                  >
                    {registerMutation.isLoading ? "Registering..." : "Register"}
                  </button>

                  <div className="flex flex-row justify-between my-2 py-2 [font-size:var(--step--1)]">
                    {/* <Link href={"/forgot-password"}>
                      <a className="text-white  hover:text-red-500 ease-in transition-all duration-75">
                        Forgot password?
                      </a>
                    </Link> */}
                    <Link href={"/login"}>
                      <a className="text-white  hover:text-red-500 ease-in transition-all duration-75">
                        Login
                      </a>
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
RegisterPage.getLayout = (children) => (
  <BaseLayout showFooter={false}>{children}</BaseLayout>
);


export default RegisterPage;
