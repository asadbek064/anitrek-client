
import { WatchPlayerProps } from "@/components/features/anime/WatchPlayer";
import Head from "@/components/shared/Head";

import useDevice from "@/hooks/useDevice";
import anime from "@/pages/upload/anime";
import NetPlayer from "netplayer";


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

interface AiEpisode {
    src: string;
    iframe: boolean;
    episode_number: number;
}

interface WatchPageProps {
    cover_img: string ;
    title: string;
    episodes: AiEpisode[];
}

const WatchPage: NextPage<WatchPageProps> = ({ episodes, title, cover_img }) => {

  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const { isMobile } = useDevice();

  const showInfoTimeout = useRef<NodeJS.Timeout>(null);
  const { t } = useTranslation("anime_watch");

  return (
    <React.Fragment>
      <Head
        title={`${title} A.I Upscaled - AnimetTV`}
        description={`Watch ${title} A.I Upscaled at AnimetTV. Completely free, no ads`}
        image={cover_img}
      />
    <div>
      
    </div>
    </React.Fragment>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  params: { params },
}) => {
  try {
    const  cover_img = "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx140960-vN39AmOWrVB5.jpg";
    const title = 'SpyXFamily';
    const episodes: AiEpisode[] = [
        {
            src: "https://player.odycdn.com/api/v4/streams/free/SpyxFamily-01-4k/3e89bb62c0ca5dce4e8a18249f71fcaba86b0801/6df04e",
            iframe: false,
            episode_number: 1
          },
          {
            src: "https://player.odycdn.com/api/v4/streams/free/SpyxFamily-02-4k-compressed/2a8770c94c52a894c623b9f4ca3d676d53a72c9c/5b1fa4",
            iframe: false,
            episode_number: 2
          },
          {
            src: "https://player.odycdn.com/api/v4/streams/free/SpyxFamily-03-4k-compressed/88808d6ab310b0e5a38f22356d89e28e997bdf30/0e7e33",
            iframe: false,
            episode_number: 3
          }
    
    ];
    return {
      props: {
        cover_img,
        title,
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
