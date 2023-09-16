import { useThemePlayer } from "@/contexts/ThemePlayerContext";
import { ControlButton } from "netplayer";
import React from "react";
import { ImShuffle } from "react-icons/im";
import ControlsIcon from "../../anime/Player/ControlsIcon";

const RefreshButton = () => {
  const { refresh } = useThemePlayer();

  return (
    <ControlButton onClick={refresh} tooltip="Play new video (Shift+N)">
      <ControlsIcon Icon={ImShuffle} />
    </ControlButton>
  );
};

export default React.memo(RefreshButton);
