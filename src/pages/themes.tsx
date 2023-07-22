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
}

interface CardDetail {
  videoTitle: string;
  thumbnail: string;
  detail: string;
}

const PlaceHolderData: CardDetail[] = [
  {videoTitle: 'Yo mama', thumbnail: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx146065-1hTpwsW2fQIA.jpg', detail:'detaill..'},
  {videoTitle: 'Yo mama', thumbnail: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx159831-TxAC0ujoLTK6.png', detail:'detaill..'},
  {videoTitle: 'Yo mama', thumbnail: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx111322-2jQMDQva4YD7.png', detail:'detaill..'},
  {videoTitle: 'Yo mama', thumbnail: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx21459-DUKLgasrgeNO.jpg', detail:'detaill..'},
];


const Card = ({ cardDetail }) => {
  return (
    <div className="flex border-y rounded-sm hover:bg-neutral-800 cursor-pointer">
      <img
        src={cardDetail.thumbnail}
        alt={cardDetail.videoTitle}
        className="w-32 h-24 rounded-tl-sm rounded-bl-sm object-cover"
      />
      <div className="ml-4">
        <h2 className="text-lg font-medium text-gray-50">{cardDetail.videoTitle}</h2>
        <p className="text-sm text-gray-400">{cardDetail.detail}</p>
      </div>
    </div>
  );
};


const ThemesPage = ({ slug, type }: ThemesPageProps) => {
  const router = useRouter();
  const { data, isLoading } = useAnimeTheme({ slug, type });

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
        description="Watch OP/ED of your favorite Anime."
      />

      <div className="space-y-8 mt-14 md:mt-24 flex justify-center">
        <ThemePlayerContextProvider
          value={{ theme: data, refresh: handleNewTheme, isLoading }}
        >
          <ThemeSettingsContextProvider>
            <div className="flex flex-col lg:flex-row">
              <div className="p-4">
                <ThemePlayer sources={sources} className="" />
              </div>

              <div className="w-full lg:w-1/4 p-4">
                <ul className="space-y-4">
                  {PlaceHolderData.map((card, index) => (
                    <Card key={index} cardDetail={card} />
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
  return {
    props: {
      slug: query.slug || null,
      type: query.type || null,
    },
  };
};

export default ThemesPage;
