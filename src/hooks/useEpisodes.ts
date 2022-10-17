import { AnimeSourceConnection } from "@/types";
import { sortMediaUnit } from "@/utils/data";
import { supabaseClient as supabase } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";

const query = `
  *,
  episodes:kaguya_episodes(
      *,
      source:kaguya_sources(
          *
      )
  )
`;

const useEpisodes = (mediaId: number) => {
  return useQuery(["episodes", mediaId], async () => {
    const { data, error } = await supabase
      .from<AnimeSourceConnection>("kaguya_anime_source")
      .select(query)
      .eq("mediaId", mediaId);

    if (error) throw error;

    const episodes = data?.flatMap((connection) => connection.episodes);
    
    let sortedEpisodes = sortMediaUnit(
      episodes.filter((episode) => episode.published)
    );
    
    // CR detection 
    let CR_ID = await getCRavilable(sortedEpisodes[0].sourceMediaId);
    
    if (CR_ID !== null) {
      localStorage.setItem('CR_ID', JSON.stringify(CR_ID));
    } else {
      if (localStorage.get('CR_ID') !== undefined) {
        localStorage.removeItem('CR_ID');
      }
    }

    return sortedEpisodes;
  });
};

// check CR available
async function getCRavilable(sourceMediaId:string){
  let BASE_URL = `http://localhost:8080/`;

  let animeTitle = sourceMediaId.replaceAll('-', ' ');

  const response = await fetch(`${BASE_URL}api/watching/available-sources?animeTitle=${encodeURIComponent(animeTitle)}`);

  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  const responseData = await response.json();
  // check if cr status exist
  if (responseData.length > 1) {
    return responseData[1].id;
  } else {
    return null;
  }
  
}

export default useEpisodes;
