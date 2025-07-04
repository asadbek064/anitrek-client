import AnimeScheduling from "@/components/features/anime/AnimeScheduling";
import RecommendedAnimeSection from "@/components/features/anime/RecommendedAnimeSection";
import WatchedSection from "@/components/features/anime/WatchedSection";
import CardSwiper from "@/components/shared/CardSwiper";
import ClientOnly from "@/components/shared/ClientOnly";
import ColumnSection from "@/components/shared/ColumnSection";
import EndOfPage from "@/components/shared/EndOfPage";
import GenreSwiper from "@/components/shared/GenreSwiper";
import Head from "@/components/shared/Head";
import HomeBanner from "@/components/shared/HomeBanner";
import NewestComments from "@/components/shared/NewestComments";
import NewestReviews from "@/components/shared/NewestReviews";
import RandomGenreSection from "@/components/shared/RandomGenreSection";
import Section from "@/components/shared/Section";
import ShouldWatch from "@/components/shared/ShouldWatch";
import ListSwiperSkeleton from "@/components/skeletons/ListSwiperSkeleton";
import { GENRES } from "@/constants/en";
import useDevice from "@/hooks/useDevice";
import useMedia from "@/hooks/useMedia";
import useRecentlyUpdated from "@/hooks/useRecentlyUpdated";
import useRecommendations from "@/hooks/useRecommendations";
import { MediaSort, MediaType } from "@/types/anilist";
import { getSeason, randomElement } from "@/utils";
import { useUser } from "@supabase/auth-helpers-react";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import React, { useMemo, useState } from "react";
import { isMobile } from "react-device-detect";

const getRandomStartIndex = () => Math.floor(Math.random() * GENRES.length);

const Home = () => {
  const currentSeason = useMemo(getSeason, []);
  const { isDesktop } = useDevice();
  const { t } = useTranslation();
  const { user } = useUser();

  const { data: trendingAnime, isLoading: trendingLoading } = useMedia({
    type: MediaType.Anime,
    sort: [MediaSort.Trending_desc, MediaSort.Popularity_desc],
    perPage: isMobile ? 15 : 20,
  });

  const { data: popularSeason, isLoading: popularSeasonLoading } = useMedia({
    type: MediaType.Anime,
    sort: [MediaSort.Popularity_desc],
    season: currentSeason.season,
    seasonYear: currentSeason.year,
    perPage: 10,
  });

  const { data: popularAllTime, isLoading: popularAllTimeLoading } = useMedia({
    type: MediaType.Anime,
    sort: [MediaSort.Popularity_desc],
    perPage: 10,
  });

  const { data: favouriteSeason, isLoading: favouriteSeasonLoading } = useMedia(
    {
      type: MediaType.Anime,
      sort: [MediaSort.Favourites_desc],
      season: currentSeason.season,
      seasonYear: currentSeason.year,
      perPage: 10,
    }
  );

  const { data: favouriteAllTime, isLoading: favouriteAllTimeLoading } =
    useMedia({
      type: MediaType.Anime,
      sort: [MediaSort.Favourites_desc],
      perPage: 10,
    });

  const { data: recentlyUpdated, isLoading: recentlyUpdatedLoading } = useRecentlyUpdated();

  const randomTrendingAnime = useMemo(() => {
    return randomElement(trendingAnime || []);
  }, [trendingAnime]);

/*   const { data: recommendationsAnime } = useRecommendations(
    {
      mediaId: randomTrendingAnime?.id,
    },
    { enabled: !!randomTrendingAnime }
  ); */

  /* const randomAnime = useMemo(
    () => randomElement(recommendationsAnime || [])?.media,
    [recommendationsAnime]
  ); */

  const limit = 2;
  const start = getRandomStartIndex();

  // Ensure unique selection of genres
  const selectedGenres = [];
  for (let i = 0; i < limit; i++) {
    const index = (start + i) % GENRES.length;
    selectedGenres.push(GENRES[index]);
  }

  return (
    <React.Fragment>
      <Head
        title="AniTrek - Anime Hub"
        description="AniTrek: Unleashing the Future of Anime · Explore, track, and immerse yourself in your favorite anime and manga with AniTrek. With cutting-edge features like AI-enhanced scene search and community engagement, no ads"
      />

      <ClientOnly>
        <div className="pb-8">
          <HomeBanner data={trendingAnime ? trendingAnime : null} isLoading={trendingLoading} isManga={false}/>

          <div className="space-y-8">
            {/* {user && (
             <>
              <WatchedSection />
              <RecommendedAnimeSection />
              </>
            )} */}
            
    
            {trendingLoading ? (
              <ListSwiperSkeleton />
            ) : (
              <Section title={`${t("most_popular_season", { ns: "common" })} 🔥` }>
                <CardSwiper data={trendingAnime} />
              </Section>
            )}

           {recentlyUpdatedLoading ? (
              <ListSwiperSkeleton />
            ) : (
              <Section title={t("newly_added", { ns: "common" })}>
                <CardSwiper data={recentlyUpdated} />
              </Section>
            )}

            {selectedGenres.map((genre, index) => (
              <RandomGenreSection key={index} isMobile={isMobile} GENRE={genre.label} />
            ))}

            
             {/* 
              <Section
                isTitleLink={true}
                titleLink={'/reviews'}
                title={t("recent_reviews", { ns: "common" })}
              >
                <NewestReviews  type={MediaType.Anime} homeView={true} />
              </Section>
             */}
           
            <Section className="md:space-between flex flex-col items-center space-y-4 space-x-0 md:flex-row md:space-y-0 md:space-x-4">
             { <ColumnSection
                title={t("most_popular_season", { ns: "common" })}
                type={MediaType.Anime}
                data={popularSeason}
                viewMoreHref={`/browse?sort=popularity&type=anime&season=${currentSeason.season}&seasonYear=${currentSeason.year}`}
                isLoading={popularSeasonLoading}
              />}
              <ColumnSection
                title={t("most_popular", { ns: "common" })}
                type={MediaType.Anime}
                data={popularAllTime}
                viewMoreHref="/browse?sort=popularity&type=anime"
                isLoading={popularAllTimeLoading}
              />
              <ColumnSection
                title={t("most_favourite_season", { ns: "common" })}
                type={MediaType.Anime}
                data={favouriteSeason}
                viewMoreHref={`/browse?sort=favourites&type=anime&season=${currentSeason.season}&seasonYear=${currentSeason.year}`}
                isLoading={favouriteSeasonLoading}
              />
              <ColumnSection
                title={t("most_favourite", { ns: "common" })}
                type={MediaType.Anime}
                data={favouriteAllTime}
                viewMoreHref="/browse?sort=favourites&type=anime"
                isLoading={favouriteAllTimeLoading}
              />
            </Section>

           {/*  <NewestComments type={MediaType.Anime} />  */}


            <div
              className={classNames(
                "flex gap-8",
                isDesktop ? "flex-row" : "flex-col"
              )}
            >

              {<Section
                title={t("genres", { ns: "common" })}
                className="w-full"
              >
                <GenreSwiper
                    direction={"horizontal"} 
                    isOverflowHidden={false} 
                    className="h-[150px] md:h-[300px]" />
              </Section>}
            </div>
                
            <EndOfPage />

            <Section title={t("airing_schedule", { ns: "anime_home" })}>
              <AnimeScheduling />
            </Section>
          </div>
        </div>
      </ClientOnly>
    </React.Fragment>
  );
};

export default Home;
