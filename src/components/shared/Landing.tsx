import React from "react";
import Button from "./Button";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import FeatureCard, { FeatureCardData } from "./FeatureCard";

const Landing = () => {
    const { t } = useTranslation("landing");

    const FeatureCardData: FeatureCardData[] = [
      {
        title: t("all-in-one-place-title"),
        heading: t("all-in-one-place-heading"),
        description: t("all-in-one-place-description"),
        img :"/features/all_in_one_place.png",
        link: "/home",
      },
      {
        title: t("advance-search-title"),
        heading: t("advance-search-heading"),
        description: t("advance-search-description"),
        img :"/features/advance_search.png",
        link: "/browse?sort=TRENDING_DESC&type=anime",
      },
      {
        title: t("one-synced-title"),
        heading: t("one-synced-heading"),
        description: t("one-synced-description"),
        img :"/features/one_synced.png",
        link:"/watchlist"
      },
      {
        title: t("push-notification-title"),
        heading: t("push-notification-heading"),
        description: t("push-notification-description"),
        img :"/features/push_notification.png",
        
      },
    ]
  return (
    <div className=" text-white py-24 px-4 flex flex-col">
      <div className="container mx-auto md:text-center">
        <h1 className="mx-4 text-center md:text-center [font-size:var(--step-4)] md:[font-size:var(--step-5)] font-black mb-8
        bg-gradient-to-r from-cyan-200 to-blue-300 inline-block text-transparent bg-clip-text
        ">
          {t("heading")}
        </h1>
        <p className="text-center md:text-center [font-size:var(--step-0)] md:[font-size:var(--step-1)]  mb-12">
         {t("heading-sub")}
        </p>
        
        <div className="flex justify-center">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 duration-200 ease-in-out transition">
            {FeatureCardData.map((card, index) => (
              // eslint-disable-next-line react/jsx-key
              <FeatureCard key={index} cardData={card} />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto">
        <div className="my-16 flex justify-center flex-col md:flex-row space-y-4 md:space-x-4 md:space-y-0">
            <div className="">
              <a key={'link-home'} href={"/home"} >
                  <Button aria-label="go to discovery page" className="[font-size:var(--step--1)] md:[font-size:var(--step-0)] tracking-wide font-semibold px-4 py-3  md:py-6 md:px-8 rounded-sm  outline-sky-700" primary>{t("button-search")}</Button>
              </a>
            </div>

            <div className="flex justify-center ">
              <a key={'link-register'} href={"/register"}>
                  <Button aria-label="sign up" className="[font-size:var(--step--1)] md:[font-size:var(--step-0)] tracking-wide font-semibold px-4 py-3 md:py-6 md:px-8 rounded-sm dark:bg-neutral-900" primary>{t("button-register")}</Button>
              </a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
