import LocaleEpisodeSelector from "@/components/features/anime/Player/LocaleEpisodeSelector";
import { WatchPlayerProps } from "@/components/features/anime/WatchPlayer";
import Comments from "@/components/features/comment/Comments";
import BaseLayout from "@/components/layouts/BaseLayout";
import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import Description from "@/components/shared/Description";
import DetailsSection from "@/components/shared/DetailsSection";
import DotList from "@/components/shared/DotList";
import Head from "@/components/shared/Head";
import InfoItem from "@/components/shared/InfoItem";
import List from "@/components/shared/List";
import Loading from "@/components/shared/Loading";
import MediaDescription from "@/components/shared/MediaDescription";
import PlainCard from "@/components/shared/PlainCard";
import Portal from "@/components/shared/Portal";
import Section from "@/components/shared/Section";
import Spinner from "@/components/shared/Spinner";
import TextIcon from "@/components/shared/TextIcon";
import { useGlobalPlayer } from "@/contexts/GlobalPlayerContext";
import useDevice from "@/hooks/useDevice";
import useEventListener from "@/hooks/useEventListener";
import { useFetchSource } from "@/hooks/useFetchSource";
import useMediaDetails from "@/hooks/useMediaDetails";
import useSavedWatched from "@/hooks/useSavedWatched";
import useSaveWatched from "@/hooks/useSaveWatched";
import { episodeDetail } from "@/services/tmdb";
import { AnimeSourceConnection, Episode } from "@/types";
import { filterOutMangaOvaSpecials, getAllSeasons, parseNumberFromString, sortByReleaseDate } from "@/utils";
import { convert, getDescription, getTitle, sortMediaUnit } from "@/utils/data";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BiError } from "react-icons/bi";

const WatchPlayer = dynamic(
  () => import("@/components/features/anime/WatchPlayer"),
  {
    ssr: false,
  }
);

const blankVideo = [
  {
    file: "https://cdn.plyr.io/static/blank.mp4",
  },
];

const ForwardRefPlayer = React.memo(
  React.forwardRef<HTMLVideoElement, WatchPlayerProps>((props, ref) => (
    <WatchPlayer {...props} videoRef={ref} />
  ))
);

ForwardRefPlayer.displayName = "ForwardRefPlayer";

interface WatchPageProps {
  episodes: Episode[];
}

const WatchPage: NextPage<WatchPageProps> = ({ episodes }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const { locale } = useRouter();

  const { isMobile } = useDevice();
  const [showInfoOverlay, setShowInfoOverlay] = useState(false);
  const [showWatchedOverlay, setShowWatchedOverlay] = useState(false);
  const [declinedRewatch, setDeclinedRewatch] = useState(false);

  const showInfoTimeout = useRef<NodeJS.Timeout>(null);
  const saveWatchedInterval = useRef<NodeJS.Timer>(null);
  const saveWatchedMutation = useSaveWatched();
  const { t } = useTranslation("anime_watch");

  const { params } = router.query;

  useEventListener("visibilitychange", () => {
    if (isMobile) return;

    if (showInfoTimeout.current) {
      clearTimeout(showInfoTimeout.current);
    }

    if (!document.hidden) return;

    showInfoTimeout.current = setTimeout(() => {
      setShowInfoOverlay(true);
    }, 5000);
  });

  const sortedEpisodes = useMemo(
    () => sortMediaUnit(episodes || []),
    [episodes]
  );

  const [
    animeId,
    sourceId = sortedEpisodes[0].sourceId,
    episodeId = sortedEpisodes[0].sourceEpisodeId,
  ] = params as string[];

  const { data: anime, isLoading: animeLoading } = useMediaDetails({
    id: Number(animeId),
  });

  const {
    data: watchedEpisodeData,
    isLoading: isSavedDataLoading,
    isError: isSavedDataError,
  } = useSavedWatched(Number(animeId));

  const watchedEpisode = useMemo(
    () =>
      isSavedDataError
        ? null
        : sortedEpisodes.find(
            (episode) =>
              episode.sourceEpisodeId ===
              watchedEpisodeData?.episode?.sourceEpisodeId
          ),
    [
      isSavedDataError,
      sortedEpisodes,
      watchedEpisodeData?.episode?.sourceEpisodeId,
    ]
  );

  const sourceEpisodes = useMemo(
    () => episodes.filter((episode) => episode.sourceId === sourceId),
    [episodes, sourceId]
  );

  const currentEpisode = useMemo(
    () =>
      sourceEpisodes.find((episode) => episode.sourceEpisodeId === episodeId),
    [sourceEpisodes, episodeId]
  );

  const currentEpisodeIndex = useMemo(
    () =>
      sourceEpisodes.findIndex(
        (episode) => episode.sourceEpisodeId === episodeId
      ),
    [episodeId, sourceEpisodes]
  );

  const nextEpisode = useMemo(
    () => sourceEpisodes[currentEpisodeIndex + 1],
    [currentEpisodeIndex, sourceEpisodes]
  );

  const handleNavigateEpisode = useCallback(
    (episode: Episode) => {
      if (!episode) return;

      router.replace(
        `/anime/watch/${animeId}/${episode.sourceId}/${episode.sourceEpisodeId}`,
        null,
        {
          shallow: true,
        }
      );
    },
    [animeId, router]
  );

  const { data, isLoading, isError, error } = useFetchSource(
    currentEpisode,
    nextEpisode
  );

  // check device screen orientation landscape/portrait
  const [isLandscape, setIsLandscape] = useState(false);

  function handleResize(){
    switch (window.orientation) {
      case 90:
        setIsLandscape(true);
        break;
      case -90:
        setIsLandscape(true);
        break;
      default:
        // The orientation API isn't supported in this browser :(
        setIsLandscape(false);
        break;
    }
  }

  // Orientation detection 
  useEffect(() => {
    window.addEventListener('orientationchange', handleResize);
  })

  // Show watched overlay
  useEffect(() => {
    if (!currentEpisode.sourceEpisodeId) return;

    if (
      !watchedEpisode ||
      isSavedDataLoading ||
      isSavedDataError ||
      declinedRewatch
    )
      return;

    if (currentEpisode.sourceEpisodeId === watchedEpisode?.sourceEpisodeId) {
      setDeclinedRewatch(true);

      return;
    }

    setShowWatchedOverlay(true);
    
  }, [
    currentEpisode.sourceEpisodeId,
    declinedRewatch,
    isSavedDataError,
    isSavedDataLoading,
    watchedEpisode,
  ]);

  useEffect(() => {
    const videoEl = videoRef.current;

    if (!videoEl) return;

    const handleSaveTime = () => {
      if (saveWatchedInterval.current) {
        clearInterval(saveWatchedInterval.current);
      }
      saveWatchedInterval.current = setInterval(() => {
        saveWatchedMutation.mutate({
          media_id: Number(animeId),
          episode_id: `${currentEpisode.sourceId}-${currentEpisode.sourceEpisodeId}`,
          watched_time: videoRef.current?.currentTime,
        });
      }, 45000);
    };

    videoEl.addEventListener("canplay", handleSaveTime);
    return () => {
      clearInterval(saveWatchedInterval.current);
      videoEl.removeEventListener("canplay", handleSaveTime);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animeId, currentEpisode, videoRef.current]);

  useEffect(() => {
    const videoEl = videoRef.current;

    if (!videoEl) return;
    if (isSavedDataLoading) return;
    if (!watchedEpisodeData?.watchedTime) return;

    if (watchedEpisode?.sourceEpisodeId !== currentEpisode?.sourceEpisodeId)
      return;

    const handleVideoPlay = () => {
      videoEl.currentTime = watchedEpisodeData.watchedTime;

      videoEl.removeEventListener("canplay", handleVideoPlay);
    };

    // Only set the video time if the video is ready
    videoEl.addEventListener("canplay", handleVideoPlay);

    return () => {
      videoEl.removeEventListener("canplay", handleVideoPlay);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedEpisode?.sourceEpisodeId, videoRef.current]);

  const title = useMemo(
    () => getTitle(anime, router.locale),
    [anime, router.locale]
  );
  const description = useMemo(
    () => getDescription(anime, router.locale),
    [anime, router.locale]
  );

  const sources = useMemo(
    () => (!data?.sources?.length ? blankVideo : data.sources),
    [data?.sources]
  );

  const subtitles = useMemo(
    () => (!data?.subtitles?.length ? [] : data.subtitles),
    [data?.subtitles]
  );

  const fonts = useMemo(
    () => (!data?.fonts?.length ? [] : data.fonts),
    [data?.fonts]
  );

  useGlobalPlayer({
    playerState: {
      ref: videoRef,
      sources,
      subtitles,
      fonts,
      thumbnail: data?.thumbnail,
      className: "object-contain w-full h-full",
    },
    playerProps: {
      anime,
      currentEpisode,
      currentEpisodeIndex,
      episodes: sortedEpisodes,
      setEpisode: handleNavigateEpisode,
      sourceId,
      sources,
    },
  });

  useEffect(() => {
    if (!anime) return;

    const syncDataScript = document.querySelector("#syncData");

    syncDataScript.textContent = JSON.stringify({
      title: anime.title.userPreferred,
      aniId: Number(animeId),
      episode: parseNumberFromString(currentEpisode.name),
      id: animeId,
      nextEpUrl: nextEpisode
        ? `/anime/watch/${animeId}/${nextEpisode.sourceId}/${nextEpisode.sourceEpisodeId}`
        : null,
    });
  }, [anime, animeId, currentEpisode.name, nextEpisode]);

  if (animeLoading) {
    return (
      <div className="relative w-full min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <React.Fragment>
      <Head
        title={`${title} (${currentEpisode.name}) - AnimetTV`}
        description={`Watch ${title} (${currentEpisode.name}) at AnimetTV. Completely free, no ads`}
        image={anime.bannerImage}
      />

      {isLoading && (
        <Portal selector=".netplayer-container">
          <Loading />
        </Portal>
      )}

      {isError ? (
        <Portal selector=".netplayer-container">
          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 space-y-4">
            <div className="flex justify-center">
                <TextIcon LeftIcon={BiError}></TextIcon>
            </div>
            <p className="text-xl text-center">
                Error ({error?.response?.data?.error})
            </p>
            <p className="text-lg text-center">
              You can choose another source or try again later.
            </p>
          </div>
        </Portal>
      ) : (
        !isLoading &&
        !data?.sources?.length && (
          <Portal selector=".netplayer-container">
            <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 space-y-4">
              <div className="flex justify-center">
                <TextIcon LeftIcon={BiError}></TextIcon>
              </div>
              <p className="text-xl text-center">
                Error (No sources found)
              </p>
              <p className="text-lg text-center">
                You can choose another source or try again later. 
              </p>
            </div>
          </Portal>
        )
      )}

      {showInfoOverlay && (
        <Portal>
          <div
            className="fixed inset-0 z-[9999] flex items-center bg-black/70"
            onMouseMove={() => setShowInfoOverlay(false)}
          >
            <div className="w-11/12 px-40">
              <p className="mb-2 text-xl text-gray-200">{t("blur_heading")}</p>
              <p className="mb-8 text-5xl font-semibold">
                {title} - {currentEpisode.name}
              </p>

              <Description
                description={description || t("common:updating") + "..."}
                className="text-lg text-gray-300 line-clamp-6"
              />
            </div>
          </div>
        </Portal>
      )}

      { isLandscape ? (
            ''
          ): (
        <Portal>
          <div className="flex flex-col" >
            <Section className="gap-8 mt-8 mb-8 space-y-8 md:space-y-0 sm:px-12">
              <div className="space-y-12 md:col-span-8">
                <DetailsSection
                  title={"Episodes"}
                  className="overflow-hidden"
                >
                  {isLoading ? (
                    <div className="h-full w-full flex items-center justify-center">
                      <Spinner />
                    </div>
                  ) : (
                    <LocaleEpisodeSelector
                      mediaId={anime.id}
                      episodes={episodes}
                      activeEpisode={currentEpisode}
                      episodeLinkProps={{ shallow: true, replace: true }}
                    />
                  )}
              </DetailsSection>
              </div>
            </Section>
            
            {/* Details */}
            <Section className="mt-32 pb-4 bg-background-900">
              <div className="flex flex-col md:flex-row md:space-x-8">
                <div className="flex flex-col  justify-between py-4 mt-4  md:text-left md:items-start md:-mt-16 space-y-4">
                  
                  <div className="shrink-0 relative left-1/2 -translate-x-1/2 md:static md:left-0 md:-translate-x-0 md:w-[186px] lg:w- w-[126px] -mt-12 space-y-6">
                      <PlainCard src={anime.coverImage.extraLarge} alt={title} />
                  </div>

                  <div className="flex flex-col md:items-start items-center space-y-4 md:no-scrollbar">
                    <p className="mb-2 text-2xl md:text-4xl font-semibold">{title}</p>

                    <DotList>
                      {anime.genres.map((genre) => (
                        <span key={genre}>
                          {convert(genre, "genre", { locale })}
                        </span>
                      ))}
                    </DotList>

                    <MediaDescription
                      description={description}
                      containerClassName="mt-4 mb-8 md:w-4/6"
                      className="text-gray-300 hover:text-gray-100 transition duration-200"
                    />

                    <div className="flex flex-wrap text-xs md:text-base md:flex-row gap-x-6 gap-y-3 md:overflow-x-auto md:gap-x-16 [&>*]:shrink-0">
                      <InfoItem
                        title={t("common:country")}
                        value={convert(anime.countryOfOrigin, "country", { locale })}
                      />
                      <InfoItem
                        title={t("common:total_episodes")}
                        value={anime.episodes}
                      />

                      {anime.duration && (
                        <InfoItem
                          title={t("common:duration")}
                          value={`${anime.duration} ${t("common:minutes")}`}
                        />
                      )}

                      <InfoItem
                        title={t("common:status")}
                        value={convert(anime.status, "status", { locale })}
                      />
                      <InfoItem
                        title={t("common:age_rated")}
                        value={anime.isAdult ? "18+" : ""}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Section>

            {/* Comments */}
            <Section className="gap-8 mt-8 space-y-8 md:space-y-0 md:grid md:grid-cols-10 sm:px-12">
              <div className="space-y-12 md:col-span-8">
                <DetailsSection title={"Comments"}>
                  <Comments topic={`anime-${anime.id}`} />
                </DetailsSection>
              </div>
            </Section>

          </div>
        </Portal>
      ) }
      
    </React.Fragment>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params: { params },
}) => {
  try {
 
    const { data, error } = await supabaseClient
      .from<AnimeSourceConnection>("kaguya_anime_source")
      .select(
        `
          episodes:kaguya_episodes(*, source:kaguya_sources(*))
        `
      )
      .eq("mediaId", Number(params[0]));

    if (error) throw error;

    const episodes = data
      .flatMap((connection) => connection.episodes)
      .filter((episode) => episode.published);
    

   /*  // get episode detail
    const {data: episodesDetail} = await axios(`https://api.kaguya.app/server/episode-info/${Number(params[0])}`);
    
     */

    return {
      props: {
        episodes,
      },
    };
  } catch (err) {
    console.log(err);

    return { notFound: true };
  }
};

// @ts-ignore
WatchPage.getLayout = (page) => page;

export default WatchPage;
