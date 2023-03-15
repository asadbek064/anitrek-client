import { useGlobalPlayer } from "@/contexts/GlobalPlayerContext";
import { parseNumberFromString } from "@/utils";
import classNames from "classnames";
import { ControlButton, TimeIndicator, useInteract } from "netplayer";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { AiOutlineClose, AiOutlineExpandAlt, AiOutlineInfoCircle } from "react-icons/ai";
import { BsArrowLeft } from "react-icons/bs";
import Player, { PlayerProps } from "./Player";
import Controls from "./Player/Controls";
import EpisodesButton from "./Player/EpisodesButton";
import LocaleEpisodeSelector from "./Player/LocaleEpisodeSelector";
import MobileControls from "./Player/MobileControls";
import MobileEpisodesButton from "./Player/MobileEpisodesButton";
import MobileNextEpisode from "./Player/MobileNextEpisode";
import MobileOverlay from "./Player/MobileOverlay";
import NextEpisodeButton from "./Player/NextEpisodeButton";
import Overlay from "./Player/Overlay";
import ProgressSlider from "./Player/ProgressSlider";
import TimestampSkipButton from "./Player/TimestampSkipButton";

export interface WatchPlayerProps extends PlayerProps {
  videoRef?: React.ForwardedRef<HTMLVideoElement>;
}

const PlayerControls = React.memo(() => {
  const {
    playerProps: {
      setEpisode,
      episodes,
      currentEpisodeIndex,
      sourceId,
      anime,
      currentEpisode,
    }
  } = useGlobalPlayer();
  const { isInteracting } = useInteract();

  const sourceEpisodes = useMemo(
    () => episodes.filter((episode) => episode.sourceId === sourceId),
    [episodes, sourceId]
  );

  const nextEpisode = useMemo(
    () => sourceEpisodes[currentEpisodeIndex + 1],
    [currentEpisodeIndex, sourceEpisodes]
  );

  return (
    <Controls
      rightControlsSlot={
        <React.Fragment>
          {currentEpisodeIndex < sourceEpisodes.length - 1 && (
            <NextEpisodeButton onClick={() => setEpisode(nextEpisode)} />
          )}

          {anime?.id && (
            <EpisodesButton>
              <div className="w-[65vw] overflow-hidden bg-background-900 p-4 rounded-md">
                <LocaleEpisodeSelector
                  mediaId={anime.id}
                  episodes={episodes}
                  activeEpisode={currentEpisode}
                  episodeLinkProps={{ shallow: true, replace: true }}
                />
              </div>
            </EpisodesButton>
          )}
        </React.Fragment>
      }
    />
  )
});

PlayerControls.displayName = "PlayerControls";

const PlayerMobileControls = React.memo(() => {
  const {
    playerProps: {
      setEpisode,
      episodes,
      currentEpisodeIndex,
      sourceId,
      anime,
      currentEpisode,
    },
  } = useGlobalPlayer();

  const sourceEpisodes = useMemo(
    () => episodes.filter((episode) => episode.sourceId === sourceId),
    [episodes, sourceId]
  );

  const nextEpisode = useMemo(
    () => sourceEpisodes[currentEpisodeIndex + 1],
    [currentEpisodeIndex, sourceEpisodes]
  );

  return (
    <MobileControls
      controlsSlot={
        <React.Fragment>
          <MobileEpisodesButton>
            {(isOpen, setIsOpen) =>
              isOpen && (
                <div
                  className={classNames(
                    "fixed inset-0 z-[9999] flex w-full flex-col justify-center bg-background px-2"
                  )}
                >
                  <BsArrowLeft
                    className="absolute left-3 top-3 h-8 w-8 cursor-pointer transition duration-300 hover:text-gray-200"
                    onClick={() => setIsOpen(false)}
                  />

                  {anime?.id && (
                    <div>
                      <LocaleEpisodeSelector
                        mediaId={anime.id}
                        episodes={episodes}
                        activeEpisode={currentEpisode}
                        episodeLinkProps={{ shallow: true, replace: true }}
                      />
                    </div>
                  )}
                </div>
              )
            }
          </MobileEpisodesButton>

          {currentEpisodeIndex < sourceEpisodes.length - 1 && (
            <MobileNextEpisode onClick={() => setEpisode(nextEpisode)} />
          )}
        </React.Fragment>
      }
    />
  );
});

PlayerMobileControls.displayName = "PlayerMobileControls";

const PlayerOverlay = React.memo(() => {
  const router = useRouter();
  const { isInteracting } = useInteract();
  const {
    playerProps: { currentEpisode, anime },
    setPlayerState,
  } = useGlobalPlayer();

  return (
    <Overlay>
      <React.Fragment>
        <BsArrowLeft
          className={classNames(
            "transition-al absolute top-10 left-10 h-10 w-10 cursor-pointer duration-300 hover:text-gray-200",
            isInteracting ? "visible opacity-100" : "invisible opacity-0"
          )}
          onClick={router.back}
        />

        <div className="w-10 h-10 absolute top-4 right-8" >
          {anime?.id && (
            <Link href={`/anime/details/${anime.id}`}>
              <a
                data-tip="React-tooltip"
                target="_blank"
                className={classNames(
                  "absolute transition-all duration-300 cursor-pointer top-4 right-8 hover:text-gray-200",
                  isInteracting ? "opacity-100 visible" : "opacity-0 invisible"
                )}
              >
                <AiOutlineInfoCircle className={classNames("w-10 h-10")} />
              </a>
            </Link>
          )}
        </div>

        {anime?.idMal && (
          <TimestampSkipButton
            className="absolute right-4 bottom-20"
            episode={parseNumberFromString(currentEpisode.name)}
            malId={anime.idMal}
          />
        )}
      </React.Fragment>
    </Overlay>
  );
});

PlayerOverlay.displayName = "PlayerOverlay";

const PlayerMobileOverlay = React.memo(() => {
  const router = useRouter();
  const { isInteracting } = useInteract();
  const {
    playerProps: { currentEpisode, anime }, setPlayerState
  } = useGlobalPlayer();


  return (
    <React.Fragment>
      <MobileOverlay >
        <BsArrowLeft
          className={classNames(
            "absolute top-4 left-4 h-8 w-8 cursor-pointer transition-all duration-300 hover:text-gray-200",
            isInteracting ? "visible opacity-100" : "invisible opacity-0"
          )}
          onClick={router.back}
        />
      </MobileOverlay>

      {anime?.idMal && (
        <TimestampSkipButton
          className="absolute right-4 bottom-24 z-50"
          episode={parseNumberFromString(currentEpisode.name)}
          malId={anime.idMal}
        />
      )}
    </React.Fragment>
  );
});

PlayerMobileOverlay.displayName = "PlayerMobileOverlay";

const WatchPlayer: React.FC<WatchPlayerProps> = ({ videoRef, ...props }) => {
  const {
    playerProps: { episodes, currentEpisodeIndex, setEpisode, sourceId },
  } = useGlobalPlayer();

  const sourceEpisodes = useMemo(
    () => episodes.filter((episode) => episode.sourceId === sourceId),
    [episodes, sourceId]
  );

  const nextEpisode = useMemo(
    () => sourceEpisodes[currentEpisodeIndex + 1],
    [currentEpisodeIndex, sourceEpisodes]
  );

  const hotkeys = useMemo(
    () => [
      {
        fn: () => {
          if (currentEpisodeIndex < sourceEpisodes.length - 1) {
            setEpisode(nextEpisode);
          }
        },
        hotKey: "shift+n",
        name: "next-episode",
      },
    ],
    [currentEpisodeIndex, nextEpisode, setEpisode, sourceEpisodes.length]
  );

  const components = useMemo(
    () => ({
      Controls: PlayerControls,
      MobileControls: PlayerMobileControls,
      Overlay: PlayerOverlay,
      MobileOverlay: PlayerMobileOverlay,
    }),
    []
  );
  
   // check device screen orientation landscape/portrait
   const [isLandscape, setIsLandscape] = useState(screen.orientation.type === "landscape-primary");

   function handleResize(){
     switch (screen.orientation.type) {
       case "landscape-primary":
         setIsLandscape(true);
         break;
       case "portrait-primary":
         setIsLandscape(false);
         break;
       default:
         // The orientation API isn't supported in this browser :(
         setIsLandscape(true);
         break;
     }
   }

    // Orientation detection 
  useEffect(() => {
    window.addEventListener('orientationchange', handleResize);
  })

  return (
    
    <div className={isLandscape ? `h-screen` : `xl:mt-12 xl:mx-36 lg:mt-4 lg:mx-20`}>
      <Player
        ref={videoRef}
        components={components}
        hotkeys={hotkeys}
        autoPlay
        {...props}
      />
    </div>
  );
};

WatchPlayer.displayName = "WatchPlayer";

export default React.memo(WatchPlayer);
