import React, { useCallback, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { ThemeSettingsContextProvider } from "@/contexts/ThemeSettingsContext";
import { fetchRandomTheme, useAnimeTheme } from "@/hooks/useAnimeTheme";
import { ThemePlayerContextProvider } from "@/contexts/ThemePlayerContext";
import Head from "@/components/shared/Head";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import BaseLayout from "@/components/layouts/BaseLayout";
import Link from "next/link";
import { getMediaDetails } from "@/services/anilist";
import { Media, MediaType } from "@/types/anilist";
import Section from "@/components/shared/Section";
import { useTranslation } from "next-i18next";
import PlainCard from "@/components/shared/PlainCard";
import TextIcon from "@/components/shared/TextIcon";
import DotList from "@/components/shared/DotList";
import InfoItem from "@/components/shared/InfoItem";
import { AiFillHeart } from "react-icons/ai";
import {  MdTagFaces } from "react-icons/md";
import { createMediaDetailsUrl, numberWithCommas } from "@/utils";
import { convert } from "@/utils/data";
import Description from "@/components/shared/Description";
import Button from "@/components/shared/Button";
import { useUser } from "@supabase/auth-helpers-react";

const ThemePlayer = dynamic(
  () => import("@/components/features/themes/ThemePlayer"),
  { ssr: false }
);

const blankVideo = [
  {
    file: "https://cdn.plyr.io/static/blank.mp4",
  },
];

interface ThemesPageProps {
  slug: string;
  type: string;
  media?: Media;
}

interface CardDetail {
  videoTitle: string;
  thumbnail: string;
  detail: string;
}

const Card = ({ cardDetail, animeSlug, anilistId, media }) => {

  useEffect(() => {

  },[media]);

  return (
    // eslint-disable-next-line @next/next/link-passhref
    <Link
      href={{
        pathname:"/themes",
        query: { slug: animeSlug, type: cardDetail.slug, id: anilistId}
      }}
    >
      <div className="flex border-y rounded-sm hover:bg-neutral-800 cursor-pointer">
        {media ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={media.coverImage?.extraLarge}
            alt={media.title?.userPreferred}
            className="min-w-32 min-h-24 w-32 h-24 rounded-tl-sm rounded-bl-sm object-cover"
          />
        ): ('')}
        <div className="ml-4 p-2">
          <h2 className="text-lg font-medium text-gray-50">{cardDetail.song.title}</h2>
          <p className="text-sm text-gray-400">{cardDetail.type}</p> 
          {cardDetail?.animethemeentries[0]?.episodes ? (
            <p className="text-xs">Episode {cardDetail?.animethemeentries[0].episodes}</p>
          ): ('')} 
        </div>
      </div>
    </Link>
  );
};


const ThemesPage = ({ slug, type, media }: ThemesPageProps) => {
  const router = useRouter();
  const { data, isLoading } = useAnimeTheme({ slug, type });
  const { t } = useTranslation("themes");
  const { locale } = useRouter();
  const { user } = useUser();
  const handleNewTheme = useCallback(async () => {
    const { slug, type, anilistId } = await fetchRandomTheme();


    router.replace({
      pathname: router.pathname,
      query: {
        slug,
        type,
        id: anilistId
      },
    });
  }, [router]);

  const sources = useMemo(
    () => (isLoading || !data?.sources?.length ? blankVideo : data?.sources),
    [data?.sources, isLoading]
  );

  useEffect(() => {
    if (!data) return;

    router.replace(
      {
        pathname: router.pathname,
        query: {
          slug: data.slug,
          type: data.type,
          id: data?.anilistId
        },
      },
      null
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (slug && type) return;

    handleNewTheme();
  }, [handleNewTheme, slug, type]);

  return (
    <React.Fragment>
      <Head
        title={
          !data ? `Themes - AniTrek` : `${data.name} (${data.type}) - AniTrek`
        }
        description="Watch Openings and Ending songs (OP/ED) of your favorite anime show."
      />

    <div className="space-y-8 mt-14 md:mt-24 flex justify-center flex-col  mx-4 md:mx-14"> 
 
      <div className="">
          <ThemePlayerContextProvider
            value={{ theme: data, refresh: handleNewTheme, isLoading }}
          >
            <ThemeSettingsContextProvider>
              <div className="flex flex-col md:flex-row">             
                <div className="p-4">
                  <div>
                    <ThemePlayer sources={sources} />
                    <div className="my-1 [font-size:var(--step--3)] text-gray-300 tracking-wider opacity-40">source: 
                    <Link 
                      href={sources[0].file}
                    >
                    animethemes.moe
                    </Link></div>
                  </div>
                </div>
                
                <div className="w-full lg:w-1/3 p-4">
                <h1 className="uppercase text-xl md:text-2xl font-semibold mb-4">{t("related")}</h1>
                <div className="overflow-y-auto min-h-[24rem] max-h-[24rem] md:min-h-[34rem] md:max-h-[34rem]">
                  <ul className="space-y-4 relative">
                    {data?.related.map((card, index) => (
                      <Card key={index} cardDetail={card} animeSlug={data?.slug} anilistId={data?.anilistId} media={media} />
                    ))}
                  </ul>
                </div>
                </div>
              </div>
            </ThemeSettingsContextProvider>
          </ThemePlayerContextProvider>
        </div>

        {media ? (
          <div className="w-full md:w-3/5 mt-6">
            <div className="space-y-8 p-8">
              <div className="flex flex-col items-start gap-4 text-center md:flex-row md:text-left">
                <div className="mx-auto w-[183px] shrink-0 md:mx-0">
                  <PlainCard src={media.coverImage.extraLarge} alt={media.title.english} />
                </div>

                <div className="space-y-4">
                  <h1 className="text-2xl font-semibold">{media.title.english}</h1>

                  <p className="text-gray-300">{media.title.native}</p>

                  <div className="flex flex-wrap items-center gap-x-8 text-lg">
                    {media.averageScore && (
                      <TextIcon
                        LeftIcon={MdTagFaces}
                        iconClassName="text-green-300"
                      >
                        <p>{media.averageScore}%</p>
                      </TextIcon>
                    )}

                    <TextIcon LeftIcon={AiFillHeart} iconClassName="text-sky-400">
                      <p>{numberWithCommas(media.favourites)}</p>
                    </TextIcon>

                    <DotList>
                      {media.genres.map((genre) => (
                        <span key={genre}>{convert(genre, "genre")}</span>
                      ))}
                    </DotList>
                  </div>

                  <div className="flex snap-x snap-mandatory space-x-8 overflow-x-auto md:space-x-16">
                    <InfoItem
                      title={t("common:country")}
                      value={media.countryOfOrigin}
                    />
                    <InfoItem
                      title={t("common:total_episodes")}
                      value={media.episodes}
                    />

                    {media.duration && (
                      <InfoItem
                        title={t("common:duration")}
                        value={`${media.duration} ${t("common:minutes")}`}
                      />
                    )}

                    <InfoItem
                      title={t("common:status")}
                      value={convert(media.status, "status", { locale })}
                    />

                    <InfoItem
                      title={t("common:age_rated")}
                      value={media.isAdult ? "18+" : ""}
                    />
                  </div>

                  <Description
                    description={media.description}
                    className="text-gray-300 line-clamp-5"
                  />

                  <Link href={createMediaDetailsUrl(media)}>
                    <a className="block">
                      {user ? (
                        <Button primary className="mx-auto md:mx-auto">
                        <p>{t("common:watch_now")}</p>
                      </Button>
                      ): (
                        <Button primary className="mx-auto md:mx-auto">
                          <p>Add to watchlist</p>
                        </Button>
                      )}
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
        ) : ('')}        
    </div>
      
   
    </React.Fragment>
  );
};


ThemesPage.getLayout = (children) => (
  <BaseLayout showHeader={true}>
    <React.Fragment>{children}</React.Fragment>
  </BaseLayout>
);

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (query.id) {
    const media = await getMediaDetails({
      type: MediaType.Anime,
      id: Number(query?.id),
    });
    return {
      props: {
        slug: query.slug || null,
        type: query.type || null,
        media: media
      },
    };
  } else {
    return {
      props: {
        slug: query.slug || null,
        type: query.type || null,
        media: null
      },
    };
  }

};

export default ThemesPage;
