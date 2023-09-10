import React from "react";
import { FiStar, FiUsers, FiMonitor } from "react-icons/fi";
import Image from "next/image";
import Button from "./Button";
import Link from "next/link";
import { useTranslation } from "next-i18next";

const Landing = () => {
    const { t } = useTranslation("landing");

  return (
    <div className=" text-white py-24 px-4 flex flex-col">
      <div className="container mx-auto md:text-center">
        <h1 className="text-center md:text-center [font-size:var(--step-4)] md:[font-size:var(--step-6)] font-black mb-8
        bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text
        ">
          {t("heading")}
        </h1>
        <p className="text-center md:text-center [font-size:var(--step-0)] md:[font-size:var(--step-1)]  mb-12">
         {t("heading-sub")}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8 leading-6 md:leading-8">
          <div className="p-2 md:p-6 md:bg-neutral-800 rounded-lg md:shadow-lg flex flex-row md:flex-col justify-center space-x-2">
            <div className="w-1/4 md:w-full">
              <FiStar className="[font-size:var(--step-4)] text-primary-500 mx-auto mb-4" />
            </div>
            <div className="w-full">
              <h2 className="[font-size:var(--step-1)] font-semibold mb-4 md:tracking-wide">
                {t("discover-head")}
              </h2>
              <p className="[font-size:var(--step--2)] md:[font-size:var(--step-0)] mb-4">
              {t("discover-sub")}
              </p>
            </div>
          </div>

          <div className="p-2 md:p-6 md:bg-neutral-800 rounded-lg md:shadow-lg flex flex-row md:flex-col justify-center space-x-2">
            <div className="w-1/4 md:w-full">
              <FiUsers className="[font-size:var(--step-4)] text-primary-500 mx-auto mb-4" />
            </div>
            <div className="w-full">
              <h2 className="[font-size:var(--step-1)] font-semibold mb-4 md:tracking-wide ">
              {t("engage-head")}
              </h2>
              <p className="[font-size:var(--step--2)] md:[font-size:var(--step-0)] mb-4">
              {t("engage-sub")}
              </p>
            </div>
          </div>
          <div className="p-2 md:p-6 md:bg-neutral-800 rounded-lg md:shadow-lg flex flex-row md:flex-col justify-center space-x-2">
            <div className="w-1/4 md:w-full">
              <FiMonitor className="[font-size:var(--step-4)] text-primary-500 mx-auto mb-4" />
            </div>
            <div className="w-full">
              <h2 className="[font-size:var(--step-1)] font-semibold mb-4 md:tracking-wide">
              {t("track-head")}
              </h2>
              <p className="[font-size:var(--step--2)] md:[font-size:var(--step-0)] mb-4">
              {t("track-sub")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto">
        <div className="my-16 flex justify-center flex-col md:flex-row space-y-4 md:space-x-4 md:space-y-0">
            <div className="">
              <Link href={"/browse?type=anime"} passHref>
                  <Button className="[font-size:var(--step--1)] md:[font-size:var(--step-0)] tracking-wide font-semibold px-6 py-4  md:py-6 md:px-8 rounded outline outline-1 outline-sky-600" primary>{t("button-search")}</Button>
              </Link>
            </div>

            <div className="flex justify-center">
              <Link href={"/register"} passHref>
                  <Button className="[font-size:var(--step--1)] md:[font-size:var(--step-0)] tracking-wide font-semibold px-6 py-4 md:py-6 md:px-8 rounded outline outline-neutral-600 outline-1" secondary>{t("button-register")}</Button>
              </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
