import LocaleEpisodeSelector from "@/components/features/anime/Player/LocaleEpisodeSelector";
import Comments from "@/components/features/comment/Comments";
import AddTranslationModal from "@/components/shared/AddTranslationModal";
import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import CharacterConnectionCard from "@/components/shared/CharacterConnectionCard";
import Characters from "@/components/shared/Characters";
import DetailsBanner from "@/components/shared/DetailsBanner";
import DetailsSection from "@/components/shared/DetailsSection";
import DotList from "@/components/shared/DotList";
import Head from "@/components/shared/Head";
import InfoItem from "@/components/shared/InfoItem";
import List from "@/components/shared/List";
import MediaDescription from "@/components/shared/MediaDescription";
import NotificationButton from "@/components/shared/NotificationButton";
import PlainCard from "@/components/shared/PlainCard";
import Popup from "@/components/shared/Popup";
import ThemeLite from "@/components/shared/ThemeLite";
import Section from "@/components/shared/Section";
import SourceStatus from "@/components/shared/SourceStatus";
import Spinner from "@/components/shared/Spinner";
import TextIcon from "@/components/shared/TextIcon";
import { DISCORD_URL, REVALIDATE_TIME } from "@/constants";
import withRedirect from "@/hocs/withRedirect";
import useEpisodes from "@/hooks/useEpisodes";
import dayjs from "@/lib/dayjs";
import { getMediaDetails } from "@/services/anilist";

import { Media, MediaType } from "@/types/anilist";
import {
  createStudioDetailsUrl,
  filterOutMangaOvaSpecials,
  numberWithCommas,
  sortByReleaseDate,
  vietnameseSlug,
} from "@/utils";
import { convert, getDescription, getTitle } from "@/utils/data";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { GetStaticPaths, GetStaticProps, NextPage, NextPageContext } from "next";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { AiFillHeart, AiOutlineUpload } from "react-icons/ai";
import { BiBookAdd, BiDotsHorizontalRounded } from "react-icons/bi";
import { BsFillPlayFill, BsPencilFill } from "react-icons/bs";
import { FaDiscord } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { MdTagFaces } from "react-icons/md";
import AnimeStatus from "@/components/shared/AnimeStatus";
import { isMobile } from "react-device-detect";
import WatchProvider from "@/components/features/watch-provider/WatchProvider";

interface DetailsPageProps {
  anime: Media;
}

const DetailsPage: NextPage<DetailsPageProps> = ({ anime }) => {
  const { user } = useUser();
  const { locale } = useRouter();

  const { t } = useTranslation("anime_details");

  const { data: episodes, isLoading } = useEpisodes(anime.id);

  const nextAiringSchedule = useMemo(
    () =>
      anime?.airingSchedule?.nodes
        ?.sort((a, b) => a.episode - b.episode)
        .find((schedule) => dayjs.unix(schedule.airingAt).isAfter(dayjs())),
    [anime?.airingSchedule]
  );

  const nextAiringScheduleTime = useMemo(() => {
    if (!nextAiringSchedule?.airingAt) return null;

    return dayjs.unix(nextAiringSchedule.airingAt).locale(locale).fromNow();
  }, [nextAiringSchedule?.airingAt, locale]);

  const title = useMemo(() => getTitle(anime, locale), [anime, locale]);
  const description = useMemo(
    () => getDescription(anime, locale),
    [anime, locale]
  );

  useEffect(() => {
    if (!anime) return;

    const syncDataScript = document.querySelector("#syncData");

    syncDataScript.textContent = JSON.stringify({
      title: anime.title.userPreferred,
      aniId: Number(anime.id),
      episode: null,
      id: anime.id,
      nextEpUrl: null,
    });

  }, [anime]);


  
  return (
    <>
      <Head
        title={`${title} - AniTrek`}
        description={description}
        image={anime.bannerImage}
      />

      <div className="pb-8">
        <DetailsBanner image={anime.bannerImage} />

        <Section className="relative pb-4 bg-background-900">
          <div className="flex flex-col md:flex-row md:space-x-8">
            <div>
              <div className="flex flex-row space-x-3">
                <div className="shrink-0 relative md:static md:left-0 md:-translate-x-0 w-[125px] md:w-[250px] -mt-36 md:-ml-0 md:-mt-20 space-y-6">
                  <PlainCard src={anime.coverImage.extraLarge} alt={title} />
                  {(user && !isMobile) && (
                    <div className="flex items-center space-x-1">
                      <SourceStatus type="anime" source={anime} />
                      <NotificationButton type="anime" source={anime} />
                    </div>
                  )}

                </div>
                <div className="flex flex-col space-y-2 -mt-14 md:hidden">
                    <AnimeStatus status={anime.status} />

                    {anime.episodes && (
                      <div className="[font-size:var(--step-1)]"><span className="font-semibold">{anime.episodes} eps</span> aired</div>
                    )}

                    {user ? (
                      <div className="flex flex-col">
                      <SourceStatus type="anime" source={anime} />
                    </div>
                    ) : (
                      <Link href={"/login"}>
                      <a target={"_blank"}>
                        <Button primary LeftIcon={BiBookAdd}>
                          <div>Start Tracking</div>
                        </Button>
                      </a>
                    </Link>
                    )}
                 </div>
              </div>
                
              <div className="my-4 md:hidden">
                {user && (
                  <div className="flex flex-col space-y-2">
                    <div className="flex flex-row space-x-4 pt-2">

                    <div>
                      <NotificationButton type="anime" source={anime} />
                    </div>
                      
                      <div>
                        <Link href={`/reviews/create/${anime.id}`}>
                          <a className="w-full">
                            <Button
                              secondary
                              className="[font-size:var(--step--1)]"
                              LeftIcon={BsPencilFill}
                            >
                              <div>Write a Review</div>
                            </Button>
                          </a>
                        </Link>
                      </div>
                      
                      <div>
                        <AddTranslationModal
                          mediaId={anime.id}
                          mediaType={MediaType.Anime}
                          defaultDescription={description}
                          defaultTitle={title}
                          textLimit={2000}
                        />
                      </div>

                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col  justify-between md:py-4  md:text-left md:items-start md:-mt-16 space-y-4">
              <div className="flex flex-col md:items-start items-center space-y-3 md:space-y-4 md:no-scrollbar">
                <div className="flex items-center flex-wrap gap-2 mb-4">
                  {user ? (
                    <div>
                      {episodes && episodes.length > 0 ? (
                        ""
                      ) : (
                        null
                      )}
                    </div>
                  ) : (
                    <div className="md:block hidden">
                      <Link href={"/login"}>
                        <a target={"_blank"}>
                          <Button primary LeftIcon={BiBookAdd}>
                            <div>Start Tracking</div>
                          </Button>
                        </a>
                      </Link>
                    </div>
                  )}

                  {!isMobile && (
                     <Popup
                     reference={
                       <Button
                         className="!bg-[#393a3b]"
                         LeftIcon={BiDotsHorizontalRounded}
                       ></Button>
                     }
                     placement="bottom"
                     type="click"
                     className="space-y-2"
                   >
                     {/*  <Link href={`/wwf/create/${anime.id}`}>
                       <a>
                         <Button
                           secondary
                           className="w-full"
                           LeftIcon={BsFillPlayFill}
                         >
                           <p>{t("watch_with_friends")}</p>
                         </Button>
                       </a>
                     </Link> */}
 
                     <Link href={`/reviews/create/${anime.id}`}>
                       <a>
                         <Button
                           secondary
                           className="w-full"
                           LeftIcon={BsPencilFill}
                         >
                           <div>Write a Review</div>
                         </Button>
                       </a>
                     </Link>
 
                     <AddTranslationModal
                       mediaId={anime.id}
                       mediaType={MediaType.Anime}
                       defaultDescription={description}
                       defaultTitle={title}
                       textLimit={2000}
                     />
 
                   {/*   <Link href={`/upload/anime/${anime.id}`}>
                       <a>
                         <Button
                           secondary
                           className="w-full"
                           LeftIcon={AiOutlineUpload}
                         >
                           <p>Upload</p>
                         </Button>
                       </a>
                     </Link> */}
                   </Popup>
                  )}
                </div>

                <p className="mb-2 [font-size:var(--step-2)] font-semibold">
                  {title}
                </p>

                <DotList>
                  {anime.genres.map((genre) => (
                    <span key={genre}>
                      {convert(genre, "genre", { locale })}
                    </span>
                  ))}
                </DotList>

                <div className="mt-4 flex flex-wrap items-center gap-x-8 text-lg">
                  {anime.averageScore && (
                    <TextIcon
                      LeftIcon={MdTagFaces}
                      iconClassName="text-primary-300"
                    >
                      <p>{anime.averageScore}%</p>
                    </TextIcon>
                  )}
                  <TextIcon LeftIcon={AiFillHeart} iconClassName="text-sky-400">
                    <p>{numberWithCommas(anime.favourites)}</p>
                  </TextIcon>
                </div>

                <MediaDescription
                  description={description}
                  containerClassName="mt-4 mb-8"
                  className="text-gray-300 hover:text-gray-100 transition duration-200"
                />

                {/* MAL-Sync UI */}
                <div id="mal-sync"></div>
              </div>

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

                {nextAiringSchedule && (
                  <InfoItem
                    className="!text-primary-300"
                    title={t("next_airing_schedule")}
                    value={`${t("common:episode")} ${
                      nextAiringSchedule.episode
                    }: ${nextAiringScheduleTime}`}
                  />
                )}
              </div>
            </div>
          </div>
        </Section>

        <Section className="w-full min-h-screen gap-8 mt-8 space-y-8 md:space-y-0 md:grid md:grid-cols-10 sm:px-12">
          <div className="space-y-12 md:col-span-8">
             {/* <DetailsSection
                title={t("episodes_section")}
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
                  />
                )}
              </DetailsSection>  */}

            <ThemeLite media={anime} /> 

            <WatchProvider media={anime} />
            
            <DetailsSection title={t("comments_section")}>
              <Comments topic={`anime-${anime.id}`} />
            </DetailsSection>

            {/* {!!anime?.characters?.edges?.length && (
                  <DetailsSection
                    title={t("characters_section")}
                    className="grid w-full grid-cols-1 gap-4 md:grid-cols-2"
                  >
                    {anime.characters.edges.map((characterEdge, index) => (
                      <CharacterConnectionCard
                        characterEdge={characterEdge}
                        key={index}
                      />
                    ))}
                  </DetailsSection>
                )} */}

            <DetailsSection title={t("characters_section")}>
              <Characters data={anime} />
            </DetailsSection>

            {!!anime?.relations?.nodes?.length && (
              <DetailsSection title={t("relations_section")}>
                <List
                  data={sortByReleaseDate(
                    filterOutMangaOvaSpecials(anime.relations.nodes)
                  ).filter((x, i) => i < 8)}
                >
                  {(node) => <Card data={node} />}
                </List>
              </DetailsSection>
            )}

            {!!anime?.recommendations?.nodes?.length && (
              <DetailsSection title={t("recommendations_section")}>
                <List
                  data={anime.recommendations.nodes
                    .map((node) => node.mediaRecommendation)
                    .filter((x, i) => i < 12)}
                >
                  {(node) => <Card data={node} />}
                </List>
              </DetailsSection>
            )}

            {/*  {!!anime?.characters?.edges?.length && (
              <DetailsSection
                title={t("characters_section")}
                className="grid w-full grid-cols-1 gap-4 md:grid-cols-2"
              >
                {anime.characters.edges.map((characterEdge, index) => (
                  <CharacterConnectionCard
                    characterEdge={characterEdge}
                    key={index}
                  />
                ))}
              </DetailsSection>
            )} */}
          </div>

          <div className="hidden md:block md:col-span-2 xl:h-[max-content] space-y-4">
            <div className="flex flex-row md:flex-col overflow-x-auto bg-background-900 rounded-md p-4 gap-4 [&>*]:shrink-0 md:no-scrollbar">
              <InfoItem
                title={t("common:format")}
                value={convert(anime.format, "format", { locale })}
              />
              <InfoItem title="English" value={anime.title.english} />
              <InfoItem title="Native" value={anime.title.native} />
              <InfoItem title="Romanji" value={anime.title.romaji} />
              <InfoItem
                title={t("common:popular")}
                value={numberWithCommas(anime.popularity)}
              />
              <InfoItem
                title={t("common:favourite")}
                value={numberWithCommas(anime.favourites)}
              />
              <InfoItem
                title={t("common:trending")}
                value={numberWithCommas(anime.trending)}
              />

              <InfoItem
                title="Studio"
                value={anime.studios.nodes.map((studio) => (
                  <div key={studio.id}>
                    <Link href={createStudioDetailsUrl(studio)}>
                      <a className="hover:text-primary-300 transition duration-200">
                        {studio.name}
                      </a>
                    </Link>
                  </div>
                ))}
              />

              <InfoItem
                title={t("common:season")}
                value={`${convert(anime.season, "season", { locale })} ${
                  anime.seasonYear
                }`}
              />
              <InfoItem
                title={t("common:synonyms")}
                value={anime.synonyms.map((synomym) => (
                  <div key={synomym}>{synomym}</div>
                ))}
              />
            </div>

            <div className="space-y-2 text-gray-400">
              <h1 className="font-semibold">Tags</h1>

              <ul className="overflow-x-auto flex flex-row md:flex-col gap-2 [&>*]:shrink-0 md:no-scrollbar">
                {anime.tags.map((tag) => (
                  <Link
                    href={{
                      pathname: "/browse",
                      query: { type: "anime", tags: tag.name },
                    }}
                    key={tag.id}
                  >
                    <a className="md:block">
                      <li className="p-2 rounded-md bg-background-900 hover:text-primary-300 transition duration-200">
                        {tag.name}
                      </li>
                    </a>
                  </Link>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      </div>
    </>
  );
};

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export const getStaticProps: GetStaticProps = async ({
  params: { params },
  locale
}) => {
  try {
    // default anime details
    /*  const { data: isDMCA } = await supabaseClient
      .from("kaguya_dmca")
      .select("id")
      .eq("mediaId", params[0])
      .eq("mediaType", MediaType.Anime)
      .single();

    if (isDMCA) {
      return {
        props: null,
        redirect: {
          destination: "/got-dmca",
        },
      };
    } */

    
    const media = await getMediaDetails({
      type: MediaType.Anime,
      id: Number(params[0]),
    });

    // filter out each nodes in media.recommendations by isAdult = false and set it to new array
   /*  const filteredRecommendations = media.recommendations.nodes.filter(
      (node) => node.mediaRecommendation.isAdult === false
    );
    // set media.recommendations.nodes to new array
    media.recommendations.nodes = filteredRecommendations;
 */
    
    return {
      props: {
        anime: media as Media,
        ...(await serverSideTranslations(locale || 'en', ['_error_page', '404_page','anime_details', 'anime_home', 'anime_watch', 'browse', 'character_details', 'comment', 'delete_modal', 'footer', 'header', 'landing', 'login', 'manga_detail', 'manga_home', 'manga_read', 'notification', 'pwa_install_prompt', 'register', 'review', 'theme', 'trace', 'trivia', 'voice_actor_detail', 'wwwf']))
      },
      revalidate: REVALIDATE_TIME,
    };
  } catch (err) {
    return { notFound: true, revalidate: REVALIDATE_TIME };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: "blocking" };
};

export default withRedirect(DetailsPage, (router, props) => {
  const { params } = router.query;
  const [id, slug] = params as string[];
  const title = getTitle(props.anime, router.locale);
  
  if (slug) return null;

  return {
    url: `/anime/details/${id}/${title}`,
    options: {
      shallow: true,
    },
  };
});
