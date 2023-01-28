
import { WatchPlayerProps } from "@/components/features/anime/WatchPlayer";
import Head from "@/components/shared/Head";
import Iframe from "@/components/shared/Iframe";

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

export interface AiEpisode {
    src: string;
    iframe: boolean;
    episode_number: number;
}

interface WatchPageProps {
    cover_img: string ;
    internal: boolean;
    title: string;
    episodes: AiEpisode[];
}

const WatchPage: NextPage<WatchPageProps> = ({ episodes, title, cover_img, internal }) => {
  const router = useRouter();
  const { isMobile } = useDevice();

  const { t } = useTranslation("anime_watch");
  
  const [selectedSource, setSelectedSource] = useState(null);


  const handleEpisodeChange = (episode: number) => {
    const selectedEpisode: AiEpisode = episodes[episode];
    const externalPlayerDomain = "https://internal.animet.site/";
    const useHLS = selectedEpisode.src.includes("m3u8");
    const source =`${externalPlayerDomain}/plyr.html?source=${encodeURIComponent(selectedEpisode.src)}&useHLS=${useHLS}`;
    setSelectedSource(source);
    
  }
   // load the first episode always
   useEffect(() => {
    handleEpisodeChange(0);
  }, []);


  return (
    <React.Fragment>
      <Head
        title={`${title} A.I Upscaled - AnimetTV`}
        description={`Watch ${title} A.I Upscaled at AnimetTV. Completely free, no ads`}
        image={cover_img}
      />
    <div>

      <div className="container mx-auto">
      <div className="flex items-center justify-start m-2">
        <button
          className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-800 hover:bg-white/20"
          onClick={() => router.back()}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
                             strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
      </div>
      
        {internal ? (
        
              <div className="relative ">
                <Iframe src={selectedSource} />
              </div>
          ) : (
            ''
          )}

      <div className="mt-4 px-4">
          <div className="text-lg font-medium tracking-wide">{title}</div>
          <div className="mt-4">
            
            <div className="grid xl:grid-cols-12 lg:grid-cols-7 md:grid-cols-6 sm:grid-cols-5 grid-cols-4 gap-2">
                {episodes.map(episode => (
                    <div key={episode.episode_number} className="bg-neutral-800 hover:bg-white/20 cursor-pointer  rounded-lg p-4">
                        <div className="text-lg font-medium">{episode.episode_number}</div>
                    </div>
                ))}
            </div>
              
          </div>
        </div>
    </div>


  
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

    const internal = episodes[0].iframe ? false : true;
    return {
      props: {
        cover_img,
        title,
        episodes,
        internal
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
