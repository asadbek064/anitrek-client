import { AiringSort } from "@/types/anilist";
import { removeArrayOfObjectDup } from "@/utils";
import dayjs from "dayjs";
import { useMemo } from "react";
import { isMobile } from "react-device-detect";
import useAiringSchedules from "./useAiringSchedules";

const useRecentlyUpdated = () => {
  const { data, isLoading, ...rest } = useAiringSchedules({
    airingAt_greater: 0,
    airingAt_lesser: dayjs().unix() - 1000,
    perPage: isMobile ? 5 : 15,
    sort: [AiringSort.Time_desc],
  });

  const mediaList = useMemo(() => {
    if (isLoading) return null;

    return removeArrayOfObjectDup(
      data?.map((schedule) => schedule.media) || [],
      "id"
    );
  }, [data, isLoading]);
  
  
  const mediaListFilterHentai = useMemo(() => {
    if (isLoading) return null;
    
    return mediaList?.filter((media) => media?.genres?.indexOf("Hentai") === -1);
  }, [mediaList, isLoading]);

  
  return {
    data: mediaListFilterHentai,
    isLoading,
    ...rest,
  };
};

export default useRecentlyUpdated;
