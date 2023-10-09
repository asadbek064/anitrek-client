import ClientOnly from "@/components/shared/ClientOnly";
import Head from "@/components/shared/Head";
import Landing from "@/components/shared/Landing";
import NewestComments from "@/components/shared/NewestComments";
import NewestReviews from "@/components/shared/NewestReviews";
import Section from "@/components/shared/Section";
import useDevice from "@/hooks/useDevice";
import useMedia from "@/hooks/useMedia";
import useRecommendations from "@/hooks/useRecommendations";
import { MediaSort, MediaType } from "@/types/anilist";
import { getSeason, randomElement } from "@/utils";
import { useTranslation } from "next-i18next";
import React, { useMemo } from "react";
import { isMobile } from "react-device-detect";

const Home = () => {
  const currentSeason = useMemo(getSeason, []);
  const { isDesktop } = useDevice();
  const { t } = useTranslation("review");

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
            
            {/* <Section
              isTitleLink={true}
              titleLink={'/reviews'}
              title={t("recent_reviews")}
            >
              <NewestReviews  type={MediaType.Anime} homeView={true} />

            </Section> */}


            {/* <NewestComments type={MediaType.Anime} /> */}


          </div>
        </div>
      </ClientOnly>
    </React.Fragment>
  );
};

export default Home;
