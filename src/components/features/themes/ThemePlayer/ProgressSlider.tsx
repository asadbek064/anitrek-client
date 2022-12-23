import React from "react";
import PlayerProgressSlider from "@/components/features/anime/Player/ProgressSlider";
import classNames from "classnames";
import { isDesktop } from "react-device-detect";

const ProgressSlider = () => {
  return (
    <PlayerProgressSlider
      hideDot
      className={classNames("h-2 "
      )}
      innerClassName={classNames(
        "h-2"
      )}
    />
  );
};

export default ProgressSlider;
