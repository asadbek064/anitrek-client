import Section from "@/components/shared/Section";
import withAdditionalUser from "@/hocs/withAdditionalUser";
import { getMedia } from "@/services/anilist";
import { AdditionalUser, KaguyaWatched, Watched, watchListSource } from "@/types";
import { Media, MediaType } from "@/types/anilist";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextPage } from "next";
import Head from "@/components/shared/Head";
import Link from "next/link";
import { useMemo, useState } from "react";
import List from "@/components/shared/List";
import Card from "@/components/shared/Card";
import useWatched from "@/hooks/useWatched";
interface WatchListProps {
  user: AdditionalUser;
  watchListAnime: watchListSource[];
  watchListAnimeMedia: Media[];
}

const WatchListPage: NextPage<WatchListProps> = ({
  user,
  watchListAnime = [],
  watchListAnimeMedia = [],
}) => {
  const [activeStatus, setActiveStatus] = useState("watching");
  const [media, setMedia] = useState(watchListAnimeMedia);

  const handlerStatusClick = (button) => {
    setActiveStatus(button);
    
    let filterDataList = [];
    // filter by status
    if (button !== "all") {
        filterDataList = watchListAnime.filter((item) => {
            return item.status === button.toUpperCase();
          });
    } else { 
        filterDataList = watchListAnime;
    }

    // filtered media by id of filtered status 
    const filteredMedia = filterDataList.map((item) => {
        return watchListAnimeMedia.find((media) => media.id === item.mediaId);
    });

    setMedia(filteredMedia);
  };

  return (
    <Section className="py-20">
      <Head
        title={`WatchList ${user.user_metadata.full_name} - AnimetTV`}
        description={`Watch list of ${user.user_metadata.full_name} - AnimetTV`}
      />
      <div className="mb-8 flex items-center space-x-2">
        <div className="text-2xl font-semibold text-center md:text-left">
          Watch List
        </div>
      </div>
      <div className="flex">
        <div className="px-1">
          <button
            className={
              activeStatus === "all"
                ? "bg-red-500 text-white font-bold py-2 px-4 rounded"
                : `bg-neutral-700 hover:bg-red-500 text-white font-bold py-2 px-4 rounded}`
            }
            onClick={() => handlerStatusClick("all")}
          >
            All
          </button>
        </div>
        <div className="px-1">
          <button
            className={
              activeStatus === "watching"
                ? "bg-red-500 text-white font-bold py-2 px-4 rounded"
                : `bg-neutral-700 hover:bg-red-500 text-white font-bold py-2 px-4 rounded}`
            }
            onClick={() => handlerStatusClick("watching")}
          >
            Watching
          </button>
        </div>
        <div className="px-1">
          <button
            className={
              activeStatus === "planning"
                ? "bg-red-500 text-white font-bold py-2 px-4 rounded"
                : `bg-neutral-700 hover:bg-red-500 text-white font-bold py-2 px-4 rounded}`
            }
            onClick={() => handlerStatusClick("planning")}
          >
            Planning
          </button>
        </div>
        <div className="px-1">
          <button
            className={
              activeStatus === "completed"
                ? "bg-red-500 text-white font-bold py-2 px-4 rounded"
                : `bg-neutral-700 hover:bg-red-500 text-white font-bold py-2 px-4 rounded}`
            }
            onClick={() => handlerStatusClick("completed")}
          >
            Completed
          </button>
        </div>
      </div>

        <div className="mt-8">
            <List data={media}>{(data) => <Card data={data} />}</List>
       
      </div>
                        
    </Section>
  );
};

export default WatchListPage;

const getWatchList = async (watchStatus: watchListSource[]) => {
  const animeIds = watchStatus.map((media) => media?.mediaId);

  const mediaPromises: Promise<Media[]>[] = [];

  if (animeIds.length) {
    const animePromise = getMedia({
      id_in: animeIds,
      type: MediaType.Anime,
    });

    mediaPromises.push(animePromise);
  } else {
    mediaPromises.push(Promise.resolve(null));
  }

  if (!mediaPromises?.length) {
    return {
      anime: [],
    };
  }

  const [anime = []] = await Promise.all(mediaPromises);

  return {
    anime: anime || [],
  };
};

export const getServerSideProps = withAdditionalUser({
  getServerSideProps: async (_, user) => {
    const { data: watchStatus, error } = await supabaseClient
      .from<watchListSource>("kaguya_watch_status")
      .select("mediaId, userId, status, created_at")
      .eq("userId", user.id);

    const { anime } = await getWatchList(watchStatus);

    const { data: watched } = await supabaseClient
        .from<Watched>("kaguya_watched")
        .select(
          "mediaId, episode:kaguya_episodes!episodeId(sourceEpisodeId, name, sourceId), watchedTime"
        )
        .eq("userId", user.id)
        .order("updated_at", { ascending: false });

        
        anime.forEach((item) => {
            if (item.id === watched[0].mediaId) {
                item.modNotes = watched[0].episode.name;
                item.duration = watched[0].watchedTime;
            }
        });

    return {
      props: {
        watchListAnime: watchStatus,
        watchListAnimeMedia: anime,
        /* readingListManga: manga, */
      },
    };
  },
});
