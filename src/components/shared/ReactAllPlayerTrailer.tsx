"use client";
import useThemeSearch from "@/hooks/useThemeSearch";
import { Media, MediaTrailer } from "@/types/anilist";
import React, { useEffect, useMemo } from "react";
import { useAnimeTheme } from "@/hooks/useAnimeTheme";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import dynamic from "next/dynamic";
import Controls from "../features/anime/Player/Controls";
import { ReactVidPlayerProps } from "react-all-player";
const ReactAllPlayer = dynamic(() => import("react-all-player"), {
  ssr: false
})


interface PlayerProps extends ReactVidPlayerProps {}

interface ReactAllPlayerTrailerProps  {
  media: Media;
}

const blankVideo = [
  {
    file: "https://cdn.plyr.io/static/blank.mp4",
  },
];

const Card = ({ cardDetail, animeSlug, anilistId, media }) => {
  useEffect(() => {}, [media]);

  return (
    // eslint-disable-next-line @next/next/link-passhref
    <Link
      href={{
        pathname: "/themes",
        query: { slug: animeSlug, type: cardDetail.slug, id: anilistId },
      }}
    >
      <div className="flex border-y rounded-sm hover:bg-neutral-800 cursor-pointer">
        {media ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={media.coverImage?.extraLarge}
            alt={media.title?.userPreferred}
            className="min-w-32 min-h-24 w-32 h-24 rounded-tl-sm rounded-bl-sm object-cover"
          />
        ) : (
          ""
        )}
        <div className="ml-4 p-2">
          <h2 className="text-lg font-medium text-gray-50">
            {cardDetail.song.title}
          </h2>
          <p className="text-sm text-gray-400">{cardDetail.type}</p>
          {cardDetail?.animethemeentries[0]?.episodes ? (
            <p className="text-xs">
              Episode {cardDetail?.animethemeentries[0].episodes}
            </p>
          ) : (
            ""
          )}
        </div>
      </div>
    </Link>
  );
};

const ReactAllPlayerTrailer: React.FC<ReactAllPlayerTrailerProps > = ({
  media,
}) => {
  const { data, isLoading } = useThemeSearch(media.title.userPreferred, true);
  const slug = data?.search?.anime[0].slug;
  const type = data?.search?.anime[0].animethemes[0].type;
  const { t } = useTranslation("themes");

  const { data: SourceData, isLoading: SourceLoading } = useAnimeTheme({
    slug,
    type,
  });

  const sources = useMemo(
    () =>
      isLoading || !SourceData?.sources?.length
        ? blankVideo
        : SourceData?.sources,
    [SourceData?.sources, isLoading]
  );

  return (

    <div className="my-12 flex flex-col md:flex-row">
    {/* Video Section (Left Column) */}
    <div className="md:w-2/3 p-4">
      <div className="aspect-video">
        
        <ReactAllPlayer autoPlay muted sources={sources}  />

        <div className="my-1 text-sm text-gray-300 tracking-wider opacity-40">
          source: animethemes.moe
        </div>
      </div>
    </div>
  
    {/* Playlist Section (Right Column) */}
    <div className="md:w-1/3 p-4">
      <h1 className="uppercase text-xl md:text-2xl font-semibold mb-4">
        {t("related")}
      </h1>
      <div className="overflow-y-auto min-h-[24rem] max-h-[24rem] md:min-h-[34rem] md:max-h-[34rem]">
        <ul className="space-y-4 relative">
          {SourceData?.related.map((card, index) => (
            <Card
              key={index}
              cardDetail={card}
              animeSlug={SourceData?.slug}
              anilistId={SourceData?.anilistId}
              media={media}
            />
          ))}
        </ul>
      </div>
    </div>
  </div>
  );
};

export default ReactAllPlayerTrailer;


/* <div className="aspect-video my-12">
      <div className="flex flex-col md:flex-row">
        <div className="p-4">
          <div>
            <ReactAllPlayer sources={sources} />
            <div className="my-1 [font-size:var(--step--3)] text-gray-300 tracking-wider opacity-40">source: animethemes.moe</div>

          </div>
        </div>

        <div className="w-full lg:w-1/3 p-4">
          <h1 className="uppercase text-xl md:text-2xl font-semibold mb-4">
            {t("related")}
          </h1>
          <div className="overflow-y-auto min-h-[24rem] max-h-[24rem] md:min-h-[34rem] md:max-h-[34rem]">
            <ul className="space-y-4 relative">
              {SourceData?.related.map((card, index) => (
                <Card
                  key={index}
                  cardDetail={card}
                  animeSlug={SourceData?.slug}
                  anilistId={SourceData?.anilistId}
                  media={media}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div> */