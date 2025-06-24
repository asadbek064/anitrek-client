import { CustomVideoStateContextProvider } from "@/contexts/CustomVideoStateContext";
import { useThemePlayer } from "@/contexts/ThemePlayerContext";
import { useThemeSettings } from "@/contexts/ThemeSettingsContext";
import NetPlayer, { NetPlayerProps } from "netplayer";
import React, { useEffect, useMemo, useRef } from "react";
import Controls from "./Controls";
import Overlay from "./Overlay";
import { isMobile } from "react-device-detect";

interface ThemePlayerProps extends NetPlayerProps {}

const ThemePlayer: React.FC<ThemePlayerProps> = (props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { endMode } = useThemeSettings();
  const { refresh, isLoading } = useThemePlayer();

  useEffect(() => {
    if (!videoRef.current) return;

    if (isLoading) return;

    const videoEl = videoRef.current;


    const handleVideoEnd = () => {
      if (endMode !== "refresh") return;
    };

    videoEl.addEventListener("ended", handleVideoEnd);

    return () => {
      videoEl.removeEventListener("ended", handleVideoEnd);
    };
  }, [endMode, isLoading, refresh]);

  useEffect(() => {
    if (!videoRef.current) return;

    const videoEl = videoRef.current;

    videoEl.autoplay = !isMobile;
    videoEl.volume = 0;
  }, []);

  return (
    <CustomVideoStateContextProvider>
      <NetPlayer
        autoPlay
        components={{
          Controls,
          Overlay,
          MobileControls: Controls,
          MobileOverlay: Overlay,
        }}
        ref={videoRef}
        // @ts-ignore
        crossOrigin={null}
        {...props}
        className="min-w-full min-h-full"
      >
        {props.children}
      </NetPlayer>
    </CustomVideoStateContextProvider>
  );
};

ThemePlayer.displayName = "Player";

export default ThemePlayer;
