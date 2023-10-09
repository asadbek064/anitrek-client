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
        img :"/features/all_in_one_place.png"
      },
      {
        title: t("advance-search-title"),
        heading: t("advance-search-heading"),
        description: t("advance-search-description"),
        img :"/features/advance_search.png"
      },
      {
        title: t("one-synced-title"),
        heading: t("one-synced-heading"),
        description: t("one-synced-description"),
        img :"/features/one_synced.png"
      },
      {
        title: t("push-notification-title"),
        heading: t("push-notification-heading"),
        description: t("push-notification-description"),
        img :"/features/push_notification.png"
      },
    ]
  return (
    <div className=" text-white py-24 px-4 flex flex-col">
      <div className="container mx-auto md:text-center">
        <h1 className="mx-4 text-center md:text-center [font-size:var(--step-4)] md:[font-size:var(--step-6)] font-black mb-8
        bg-gradient-to-r from-cyan-200 to-blue-300 inline-block text-transparent bg-clip-text
        ">
          {t("heading")}
        </h1>
        <p className="text-center md:text-center [font-size:var(--step-0)] md:[font-size:var(--step-1)]  mb-12">
         {t("heading-sub")}
        </p>
        
        <div className="flex justify-center">
          <div className="flex lg:flex-row flex-col lg:space-x-12 lg:space-y-0 space-y-12">
            {FeatureCardData.map((card, index) => (
              // eslint-disable-next-line react/jsx-key
              <FeatureCard cardData={card} />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto">
        <div className="my-16 flex justify-center flex-col md:flex-row space-y-4 md:space-x-4 md:space-y-0">
            <div className="">
              <Link href={"/home"} passHref>
                  <Button className="[font-size:var(--step-0)] md:[font-size:var(--step-1)] tracking-wide font-semibold px-6 py-4  md:py-6 md:px-8 rounded outline outline-1 outline-sky-600" primary>{t("button-search")}</Button>
              </Link>
            </div>

            <div className="flex justify-center">
              <Link href={"/register"} passHref>
                  <Button className="[font-size:var(--step-0)] md:[font-size:var(--step-1)] tracking-wide font-semibold px-6 py-4 md:py-6 md:px-8 rounded outline outline-neutral-600 outline-1" secondary>{t("button-register")}</Button>
              </Link>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
