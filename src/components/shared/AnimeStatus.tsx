import React from "react";

import { MediaStatus } from "@/types/anilist";

interface AnimeStatusProps extends React.HTMLAttributes<HTMLDivElement> {
    status: MediaStatus;
}

const AnimeStatus: React.FC<AnimeStatusProps> = ({ status }) => {
    let statusText = "";
  
    switch (status) {
      case MediaStatus.Finished:
        statusText = "Ended";
        break;
      case MediaStatus.Releasing:
        statusText = "Anime currently airing";
        break;
      case MediaStatus.Not_yet_released:
        statusText = "Not yet released";
        break;
      case MediaStatus.Cancelled:
        statusText = "Cancelled";
        break;
      case MediaStatus.Hiatus:
        statusText = "Hiatus";
        break;
      default:
        statusText = "";
    }
  
    return <span>{statusText}</span>;
  };

export default React.memo(AnimeStatus);
