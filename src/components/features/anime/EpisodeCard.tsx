import { Episode } from "@/types";
import React from "react";
import Image from "@/components/shared/Image";
import { parseTime } from "@/utils";

interface EpisodeCardProps {
  episode: Episode;
  isActive?: boolean;
  title?: string;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({
  episode,
  isActive,
  title,
  ...props
}) => {

  return (
    <div
      className="relative h-40 w-full hover:bg-white/20 cursor-pointer"
      {...props}
    >
      <Image
        src={episode?.thumbnail || "/error.png"}
        layout="fill"
        alt={episode.name}
        objectFit="cover"
        className="hover:scale-105 transition duration-150"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>

      <div className="w-full absolute bottom-0 p-2 space-y-1.5 ">
        <p className="text-lg font-semibold">EP {episode.name.replace('EP', '')} &nbsp; <i>{parseTime(episode.watchedTime / 2)}</i></p>
        {title && (
          <p className="text-base line-clamp-1 font-semibold text-gray-300">
            {title}
          </p>
        )}
      </div>
    </div>
  );
};

export default React.memo(EpisodeCard);
