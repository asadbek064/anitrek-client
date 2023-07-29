import React, { useCallback, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { ThemeSettingsContextProvider } from "@/contexts/ThemeSettingsContext";
import { fetchRandomTheme, useAnimeTheme } from "@/hooks/useAnimeTheme";
import { ThemePlayerContextProvider } from "@/contexts/ThemePlayerContext";
import Head from "@/components/shared/Head";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import Image from 'next/image';
import BaseLayout from "@/components/layouts/BaseLayout";
import Link from "next/link";
import { getMediaDetails } from "@/services/anilist";
import { Media, MediaType } from "@/types/anilist";
import Section from "@/components/shared/Section";
import { useTranslation } from "next-i18next";

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

  return (
    <Link
      href={{
        pathname:"/themes",
        query: { slug: animeSlug, type: cardDetail.slug, id: anilistId}
      }}
    >
      <div className="flex border-y rounded-sm hover:bg-neutral-800 cursor-pointer">
        {media ? (
          <img
            src={media.coverImage.extraLarge}
            alt={media.title.userPreferred}
            className="w-32 h-24 rounded-tl-sm rounded-bl-sm object-cover"
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
  const handleNewTheme = useCallback(async () => {
    const { slug, type } = await fetchRandomTheme();


    router.replace({
      pathname: router.pathname,
      query: {
        slug,
        type,
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
          !data ? `Themes - AnimetTV` : `${data.name} (${data.type}) - AnimetTV`
        }
        description="Watch Openings and Ending songs (OP/ED) of your favorite anime show."
      />

      <div className="space-y-8 mt-14 md:mt-24 flex justify-center">
        <ThemePlayerContextProvider
          value={{ theme: data, refresh: handleNewTheme, isLoading }}
        >
          <ThemeSettingsContextProvider>
            <div className="flex flex-col md:flex-row">
              <div className="p-4">
                <div>
                  <ThemePlayer sources={sources} />
                </div>
              </div>

              <div className="w-full lg:w-1/3 p-4">
                <h1 className="uppercase text-xl md:text-2xl font-semibold mb-4">{t("related")}</h1>
                <ul className="space-y-4 rela">
                  {data?.related.map((card, index) => (
                    <Card key={index} cardDetail={card} animeSlug={data?.slug} anilistId={data?.anilistId} media={media} />
                  ))}
                </ul>
              </div>
            </div>

          </ThemeSettingsContextProvider>
        </ThemePlayerContextProvider>
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
