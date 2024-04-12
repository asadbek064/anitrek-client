import ArrowSwiper, {
  SwiperProps,
  SwiperSlide,
} from "@/components/shared/ArrowSwiper";
import { AiOutlineDown } from "react-icons/ai";
import useDevice from "@/hooks/useDevice";
import { Episode } from "@/types";
import { chunk, groupBy } from "@/utils";
import classNames from "classnames";
import Link, { LinkProps } from "next/link";
import React, { useMemo } from "react";
import Select from 'react-select';
import { episodeDetail } from "@/services/tmdb";

export interface EpisodeSelectorProps {
  episodes: Episode[];
  mediaId?: number;
  activeEpisode?: Episode;
  chunkSwiperProps?: SwiperProps;
  episodeLinkProps?: Omit<LinkProps, "href">;
  onEachEpisode?: (episode: Episode) => React.ReactNode;
  episodeChunk?: number;
}

const EpisodeSelector: React.FC<EpisodeSelectorProps> = (props) => {
  const { isMobile } = useDevice();

  const {
    episodes,
    activeEpisode,
    chunkSwiperProps,
    episodeLinkProps,
    episodeChunk = isMobile ? 12 : 24,
    onEachEpisode = (episode) => (
      <Link
        href={`/anime/watch/${props.mediaId}/${episode.sourceId}/${episode.sourceEpisodeId}`}
        key={episode.sourceEpisodeId}
        shallow
        {...episodeLinkProps}
      >
       <a 
        className={classNames(
          "rounded-md col-span-1 aspect-w-2 aspect-h-1 group font-bold",
          episode.sourceEpisodeId === activeEpisode?.sourceEpisodeId ? "bg-blue-600" : "bg-[#424242]"
        )}
      >
        <div className="flex items-center justify-center w-full h-full group-hover:bg-primary  rounded-md transition duration-250">
          <p>{episode.name.replace('EP', '')}</p>
        </div>
      </a>
      </Link>
    ),
  } = props;

  const chunks = useMemo(
    () => chunk(episodes, episodeChunk),
    [episodeChunk, episodes]
  );

  const [activeTabIndex, setActiveTabIndex] = React.useState(() => {
    const index = chunks.findIndex((chunk) =>
      chunk.some(
        (episode) => episode.sourceEpisodeId === activeEpisode?.sourceEpisodeId
      )
    );

    return index === -1 ? 0 : index;
  });

  const realActiveTabIndex = useMemo(
    () => (activeTabIndex > chunks.length - 1 ? 0 : activeTabIndex),
    [activeTabIndex, chunks.length]
  );

  const sections = useMemo(
    () => groupBy(chunks[realActiveTabIndex], (episode) => episode.section),
    [chunks, realActiveTabIndex]
  );

  const options = chunks.map((chunk, i) => {
    const firstEpisodeName = chunk[0].name.replace("EP", "");
    const lastEpisodeName = chunk[chunk.length - 1].name.replace(
      "EP",
      ""
    );
  
    const title =
      chunk.length === 1
        ? `${firstEpisodeName}`
        : `${firstEpisodeName} - ${lastEpisodeName}`;
  
    return { value: i, label: title };
  });
  

  return (
    <React.Fragment>
      <div className="flex justify-start  mx-auto mb-8 absolute -mt-[4.50rem] ">
          <Select
            isSearchable={false}
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary: "#ef4444",
                primary75: "#f87171",
                primary50: "#fca5a5",
                primary20: "#fecaca",
              },
            })}
            styles={{
              control: (provided) => {
                return {
                  ...provided,
                  backgroundColor: "#1a1a1a",
                };
              },
              menu: (provided) => {
                return { ...provided, backgroundColor: "#1a1a1a" };
              },
              menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
              singleValue: (provided) => {
                return { ...provided, color: "#fff" };
              }, 
              option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                return {
                  ...styles,
                  backgroundColor: isFocused ? "#999999" : null,
              
                };
              }
            
              

            }}

              value={options[realActiveTabIndex]}
              onChange={(selectedOption) => setActiveTabIndex(selectedOption.value)}
              options={options}
            />
        </div> 

      <div className="mt-5 space-y-4">
        {Object.keys(sections).map((section) => {
          const episodes = sections[section];

          return (
            <div className="space-y-1" key={section}>
              {Object.keys(sections)?.length > 0 && (
                <p className="font-semibold text-gray-300">{section}</p>
              )}

                <div className="grid xl:grid-cols-12 lg:grid-cols-7 md:grid-cols-6 sm:grid-cols-5 grid-cols-4 gap-2">
                  {episodes.map(onEachEpisode)} 
                </div>
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
};

export default React.memo(EpisodeSelector);
