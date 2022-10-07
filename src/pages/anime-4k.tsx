import CardSwiper from "@/components/shared/CardSwiper";
import ClientOnly from "@/components/shared/ClientOnly";
import Head from "@/components/shared/Head";
import HomeBanner from "@/components/shared/HomeBanner";
import Section from "@/components/shared/Section";
import ListSwiperSkeleton from "@/components/skeletons/ListSwiperSkeleton";
import useAnime4K from "@/hooks/useAnime4K";
import useDevice from "@/hooks/useDevice";
import useMedia from "@/hooks/useMedia";
import useRecentlyUpdated from "@/hooks/useRecentlyUpdated";
import { MediaSort, MediaType } from "@/types/anilist";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import React from "react";
import { isMobile } from "react-device-detect";

const Anime4K = () => {
  const { isDesktop } = useDevice();
  const { t } = useTranslation();

  const { data: trendingAnime, isLoading: trendingLoading } = useMedia({
    type: MediaType.Anime,
    sort: [MediaSort.Trending_desc, MediaSort.Popularity_desc],
    perPage: isMobile ? 5 : 10,
  });


  const { data: recentlyUpdated, isLoading: recentlyUpdatedLoading } = useRecentlyUpdated();
  console.log(useAnime4K());

  return (
    <React.Fragment>
      <Head
        title="Watch Anime - AnimeOnline"
        description="Watch anime online in high quality for free. Watch anime subbed, anime dubbed online free. Update daily, fast streaming, no ads, no registration"
      />

      <ClientOnly>
        <div className="pb-8">
          <HomeBanner data={trendingAnime} isLoading={trendingLoading} />

          <div className="space-y-8">


            <Section className="md:space-between flex flex-col items-center space-y-4 space-x-0 md:flex-row md:space-y-0 md:space-x-4">
           
            </Section>
            {recentlyUpdatedLoading ? (
              <ListSwiperSkeleton />
            ) : (
              <Section title={t("newly_added", { ns: "common" })}>
                <CardSwiper data={recentlyUpdated} />
              </Section>
            )}

            <div
              className={classNames(
                "flex gap-8",
                isDesktop ? "flex-row" : "flex-col"
              )}
            >
            </div>

          </div>
        </div>
      </ClientOnly>
    </React.Fragment>
  );
};

export default Anime4K;
