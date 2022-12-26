import React from "react";
import PlayerProgressSlider from "@/components/features/anime/Player/ProgressSlider";
import classNames from "classnames";
import { isDesktop } from "react-device-detect";

const ProgressSlider = () => {
  return (
    <PlayerProgressSlider
      className={classNames(
        isDesktop ? "!h-3 hover:!h-3" : "!h-3",
        "transition-all duration-250"
      )}
    />
  );
};

export default ProgressSlider;
