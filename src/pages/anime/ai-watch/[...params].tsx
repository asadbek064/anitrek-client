
import { WatchPlayerProps } from "@/components/features/anime/WatchPlayer";
import Head from "@/components/shared/Head";
import Iframe from "@/components/shared/Iframe";
import useDevice from "@/hooks/useDevice";
import { getAiTitle } from "@/services/animettv";
import { GetServerSideProps, NextPage } from "next";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, {
  useEffect,
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
    internal: boolean;
    title: string;
    episodes: AiEpisode[];
}

const WatchPage: NextPage<WatchPageProps> = ({ episodes, title, internal }) => {
  const router = useRouter();
  const { isMobile } = useDevice();

  const { t } = useTranslation("anime_watch");
  
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedEpisodeNumber, setSelectedEpisodeNumber] = useState(null);

  const handleEpisodeChange = (episode: number) => {
    setSelectedEpisodeNumber(episode);
    
    const selectedEpisode: AiEpisode = episodes[episode-1];
    const externalPlayerDomain = "https://internal.animet.site/"; //dev http://127.0.0.1:5500
    
    const useHLS = selectedEpisode.src.includes("m3u8");

    let source = '';
    if (internal) {
      source = `${externalPlayerDomain}/plyr.html?source=${encodeURIComponent(selectedEpisode.src)}&useHLS=${useHLS}`;
    } else {
      source = selectedEpisode.src;
    }

    setSelectedSource(source);
    
  }
   // load the first episode always
   useEffect(() => {
    handleEpisodeChange(1);
  }, []);


  return (
    <React.Fragment>
      <Head
        title={`${title} A.I Upscaled - AnimetTV`}
        description={`Watch ${title} A.I Upscaled at AnimetTV. Completely free, no ads`}
      />
    <div>

      <div className="container mx-auto md:px-16 ease-in-out duration-200">
      <div className="flex items-center justify-start mt-2 mb-2 ml-2 md:ml-0">
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
      
      <div className="aspect-w-16 aspect-h-9">
        <Iframe src={selectedSource} />
      </div>

      <div className="mt-4 px-4">
          <div className="text-lg font-medium tracking-wide">{title} | Ep {selectedEpisodeNumber}</div>
          <div className="mt-4">
            
            <div className="grid xl:grid-cols-12 lg:grid-cols-7 md:grid-cols-6 sm:grid-cols-5 grid-cols-4 gap-2 ease-in-out duration-200">
                {episodes.map(episode => (
                    <div key={episode.episode_number} onClick={() => handleEpisodeChange(episode.episode_number)} className="bg-neutral-800 hover:bg-white/20 cursor-pointer  rounded-lg p-4 ease-in duration-100">
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
    const title = params[0];
    const episodes: AiEpisode[] = await getAiTitle(title);
    const internal = !episodes[0].iframe;
  
    return {
      props: {
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
