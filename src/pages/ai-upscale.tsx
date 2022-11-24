import CardSwiper from "@/components/shared/CardSwiper";
import ClientOnly from "@/components/shared/ClientOnly";
import Head from "@/components/shared/Head";
import HomeBanner from "@/components/shared/HomeBanner";
import Section from "@/components/shared/Section";
import ListSwiperSkeleton from "@/components/skeletons/ListSwiperSkeleton";
import useAnime4K from "@/hooks/useAnime4K";
import useAiTitle from "@/hooks/useAiTitles";
import useDevice from "@/hooks/useDevice";
import useMedia from "@/hooks/useMedia";
import useRecentlyUpdated from "@/hooks/useRecentlyUpdated";
import { MediaSort, MediaType } from "@/types/anilist";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import React from "react";
import { isMobile } from "react-device-detect";
import useAiTitles from "@/hooks/useAiTitles";

const AiUpscale = () => {
  const { isDesktop } = useDevice();
  const { t } = useTranslation();

  const { data: trendingAnime, isLoading: trendingLoading } = useMedia({
    type: MediaType.Anime,
    sort: [MediaSort.Trending_desc, MediaSort.Popularity_desc],
    perPage: isMobile ? 5 : 10,
  });

  const { data: aiTitles, isLoading: aiTitlesLoading } = useAiTitles();

  return (
    <React.Fragment>
      <Head
        title="Watch Anime - AnimetTV"
        description="Watch anime online in high quality for free. Watch anime subbed, anime dubbed online free. Update daily, fast streaming, no ads, no registration"
      />

      <ClientOnly>
        <div className="pb-8">
          {/* <HomeBanner data={trendingAnime} isLoading={trendingLoading} />
           */}
          <div className="space-y-8">
            <div className="grid place-content-center mt-40">
              <h1>This page under constructions.</h1>
              <br />
              <h2>
                For 4K Anime use our old website in mean time:{" "}
                <a className="text-red-500" href="https://animet.tv/experiment">
                  www.animet.tv
                </a>
              </h2>
            </div>
            <Section className="md:space-between flex flex-col items-center space-y-4 space-x-0 md:flex-row md:space-y-0 md:space-x-4"></Section>
            {aiTitlesLoading ? (
              <ListSwiperSkeleton />
            ) : (
              <Section title={t("4K Anime", { ns: "common" })}>
                <CardSwiper data={aiTitles?.Ai4k} />
              </Section>
            )}

            {aiTitlesLoading ? (
              <ListSwiperSkeleton />
            ) : (
              <Section title={t("60FPS Anime", { ns: "common" })}>
                <CardSwiper data={aiTitles.Ai60fps} />
              </Section>
            )}

          {aiTitlesLoading ? (
              <ListSwiperSkeleton />
            ) : (
              <Section title={t("Remastered", { ns: "common" })}>
                <CardSwiper data={aiTitles.AiRemastered} />
              </Section>
            )}

            <div
              className={classNames(
                "flex gap-8",
                isDesktop ? "flex-row" : "flex-col"
              )}
            ></div>
          </div>
        </div>
      </ClientOnly>
    </React.Fragment>
  );
};

export default AiUpscale;
