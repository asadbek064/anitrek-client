import classNames from "classnames";
import {
  FullscreenButton,
  TimeIndicator,
  useInteract,
  useVideo,
  useDoubleTap
} from "netplayer";
import * as React from "react";
import ProgressSlider from "./ProgressSlider";
import SkipButton from "./SkipButton";

interface MobileControlsProps {
  controlsSlot?: React.ReactNode;
}


const MobileControls: React.FC<MobileControlsProps> = ({ controlsSlot }) => {
  const { isInteracting } = useInteract();
  const { videoState } = useVideo();

   // check device screen orientation landscape/portrait
   const [isLandscape, setIsLandscape] = React.useState(false);

   function handleResize(){
    switch (window.orientation) {
      case 90:
        setIsLandscape(true);
        break;
      default:
        // The orientation API isn't supported in this browser :(
        setIsLandscape(false);
        break;
    }
  }

    // Orientation detection 
  React.useEffect(() => {
    window.addEventListener('orientationchange', handleResize);
  })
  
  return (
    <div
      className={classNames(
        "mobile-controls-container w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-all duration-150",
        !videoState.seeking && !isInteracting && !videoState.buffering
          ? "opacity-0 invisible"
          : "opacity-100 visible"
      )}
    >
      <div className="px-4 flex w-full items-center justify-between">
         <TimeIndicator />
         <div className="w-6 h-6">
          <FullscreenButton  />
        </div>
      </div>
      <div className="px-4 w-full mt-2 mb-42">
        <ProgressSlider />
      </div>

      {isLandscape ? (
        <div className="flex justify-evenly items-center py-6">
        <SkipButton />

        {controlsSlot}
      </div>
      ): ('')}
    </div>
  );
};

export default React.memo(MobileControls);
