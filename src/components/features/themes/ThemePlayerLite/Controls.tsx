import classNames from "classnames";
import {
  FullscreenButton,
  PlayPauseButton,
  SettingsButton,
  TimeIndicator,
  VolumeButton,
  useInteract,
  useVideo,
} from "netplayer";
import * as React from "react";
import { useThemePlayer } from "@/contexts/ThemePlayerContext";
import DotList from "@/components/shared/DotList";
import { isMobile } from "react-device-detect";
import ProgressSlider from "./ProgressSlider";
/* import VolumeButton from "./VolumeButton";
 */

const Controls: React.FC = () => {
  const { isInteracting } = useInteract();
  const { videoState } = useVideo();
  const { theme } = useThemePlayer();

  return (
    <div
      className={classNames(
        "controls-container w-full p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-150",
        !videoState.seeking && !isInteracting && !videoState.buffering
          ? "opacity-0 invisible"
          : "opacity-100 visible"
      )}
    >
      <div className="mb-4 mx-4">
        <ProgressSlider />
      </div>

      <div className="w-full flex justify-between items-center text-white">
        <div className="flex items-center space-x-4 ml-4">
          <PlayPauseButton />
          {!isMobile ? (
            <TimeIndicator />
          ): ''}

        </div>
        <div className="flex items-center space-x-4 mr-4">
          <VolumeButton />
          <SettingsButton />
          <FullscreenButton />
        </div>
      </div>
      <div className="mt-4 ml-4">
        {theme && (
          <DotList>
            <span>
              {theme.song.title} - {theme.type}{" "}
              {theme.episode && `(Episode ${theme.episode})`}
            </span>

            <span>{theme.name}</span>
          </DotList>
        )}
      </div>
    </div>
    
    
  );
};

export default Controls;
