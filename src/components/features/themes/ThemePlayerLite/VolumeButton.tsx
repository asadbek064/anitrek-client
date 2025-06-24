import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import VolumeMutedIcon from '@/components/icons/VolumeMutedIcon';
import { useVideo, useVideoProps, useHotKey, ControlButton, Slider } from 'netplayer';
import {BiVolumeFull, BiVolumeLow } from "react-icons/bi"
const VolumeComponents = {
  0: VolumeMutedIcon,
  0.25: BiVolumeLow,
  0.5: BiVolumeLow,
  1: BiVolumeFull,
};

const VolumeButton = () => {
  const { videoState, videoEl } = useVideo();
  const previousVolume = useRef(videoState.volume);

  useEffect(() => {
    if(videoEl?.muted) {
      videoState.volume = 0;
    }
  })

  const VolumeComponent = useMemo(() => {
    const entries = Object.entries(VolumeComponents).sort(
      (a, b) => Number(a[0]) - Number(b[0])
    );

    for (const [key, value] of entries) {
      if (videoState.volume <= Number(key)) {
        return value;
      }
    }

    return VolumeMutedIcon;
  }, [videoState.volume]);

  const handleClick = useCallback(() => {
    if (!videoEl) return;

    if (videoEl.muted) videoEl.muted = false;

    if (videoEl.volume === 0) {
      videoEl.volume = previousVolume.current;
    } else {
      previousVolume.current = videoEl.volume;
      videoEl.volume = 0;
    }
  }, [videoEl]);

  const handleVolumeChange = useCallback(
    (percent: number) => {
      if (!videoEl) return;

      if (videoEl.muted) videoEl.muted = false;

      videoEl.volume = percent / 100;
    },
    [videoEl]
  );

  return (
    <div className='flex items-center ease-in-out duration-200  hover:w-[7rem] transition w-[4rem]'>
      <ControlButton
        onClick={handleClick}
      >
        <VolumeComponent />
      </ControlButton>

      <Slider
        onPercentChange={handleVolumeChange}
        onPercentChanging={handleVolumeChange}
        className="ml-1 w-0 group-hover:w-4rem items-center flex transition-all duration-200 transform-origin-left center h-5 relative"
      >
      
        <Slider.Bar className="bg-primary-500 transition-transform ease-in" percent={videoState.volume * 100} />
        <Slider.Bar className="bg-primary-200 bg-opacity-20" />

        <Slider.Dot
          style={{
            backgroundColor: 'white',
            transition: 'opacity 100ms',
            opacity: '50',
          }}
          percent={videoState.volume * 100}
        />
      </Slider>
    </div>
  );
};

export default VolumeButton;
