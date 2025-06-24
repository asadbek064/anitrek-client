import ClientOnly from "@/components/shared/ClientOnly";
import Head from "@/components/shared/Head";
import Landing from "@/components/shared/Landing";
import NewestComments from "@/components/shared/NewestComments";
import NewestReviews from "@/components/shared/NewestReviews";
import RandomGenreSection from "@/components/shared/RandomGenreSection";
import Section from "@/components/shared/Section";
import useDevice from "@/hooks/useDevice";
import useMedia from "@/hooks/useMedia";
import useRecommendations from "@/hooks/useRecommendations";
import { MediaSort, MediaType } from "@/types/anilist";
import { getSeason, randomElement } from "@/utils";
import { useUser } from "@supabase/auth-helpers-react";
import { useTranslation } from "next-i18next";
import Router, { useRouter } from "next/router";
import React, { useEffect, useMemo } from "react";
import { isMobile } from "react-device-detect";
import { GENRES } from "@/constants/en";

const getRandomStartIndex = () => Math.floor(Math.random() * GENRES.length);

const Home = () => {
  const currentSeason = useMemo(getSeason, []);
  const { isDesktop } = useDevice();
  const { t } = useTranslation("review");
  const { user } = useUser();
  const router = useRouter();
/*   const { data: trendingAnime, isLoading: trendingLoading } = useMedia({
    type: MediaType.Anime,
    sort: [MediaSort.Trending_desc, MediaSort.Popularity_desc],
    perPage: isMobile ? 10 : 20,
  });

  const { data: popularSeason, isLoading: popularSeasonLoading } = useMedia({
    type: MediaType.Anime,
    sort: [MediaSort.Popularity_desc],
    season: currentSeason.season,
    seasonYear: currentSeason.year,
    perPage: 5,
  });

  const { data: popularAllTime, isLoading: popularAllTimeLoading } = useMedia({
    type: MediaType.Anime,
    sort: [MediaSort.Popularity_desc],
    perPage: 5,
  });

  const { data: favouriteSeason, isLoading: favouriteSeasonLoading } = useMedia(
    {
      type: MediaType.Anime,
      sort: [MediaSort.Favourites_desc],
      season: currentSeason.season,
      seasonYear: currentSeason.year,
      perPage: 5,
    }
  );

  const { data: favouriteAllTime, isLoading: favouriteAllTimeLoading } =
    useMedia({
      type: MediaType.Anime,
      sort: [MediaSort.Favourites_desc],
      perPage: 5,
    });
 */
/*   const { data: recentlyUpdated, isLoading: recentlyUpdatedLoading } = useRecentlyUpdated();
 */
/*   const randomTrendingAnime = useMemo(() => {
    return randomElement(trendingAnime || []);
  }, [trendingAnime]);

  const { data: recommendationsAnime } = useRecommendations(
    {
      mediaId: randomTrendingAnime?.id,
    },
    { enabled: !!randomTrendingAnime }
  ); */

 /*  const randomAnime = useMemo(
    () => randomElement(recommendationsAnime || [])?.media,
    [recommendationsAnime]
  ); */

  useEffect(() => {
    if (user) {
      router.push('/home')
    }
  }, [user])

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
          
          <div className="space-y-8">
           
            <Landing />
            
            {/* 
            <Section
              isTitleLink={true}
              titleLink={'/reviews'}
              title={t("recent_reviews")}
            >
              <NewestReviews  type={MediaType.Anime} homeView={true} />

            </Section> */}

            <div className="px-4 md:px-12 lg:px-20 xl:px-28 2xl:px-36
                [font-size:var(--step-3)] md:[font-size:var(--step-4)] font-black md:pb-4">Trending Anime Genres </div>
                {selectedGenres.map((genre, index) => (
                  <RandomGenreSection key={index} isMobile={isMobile} GENRE={genre.label} />
                ))}
             
            {/* <NewestComments type={MediaType.Anime} /> */}


          </div>
        </div>
      </ClientOnly>
    </React.Fragment>
  );
};

export default Home;
