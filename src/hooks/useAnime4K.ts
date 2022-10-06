import { AiringSort } from "@/types/anilist";
import { removeArrayOfObjectDup } from "@/utils";
import dayjs from "dayjs";
import { useMemo } from "react";
import { isMobile } from "react-device-detect";
import useAiTitles from "./useAiTitles";

const useAnime4K = () => {
  const { data, isLoading, ...rest } = useAiTitles();

  const mediaList = useMemo(() => {
    if (isLoading) return null;

    return removeArrayOfObjectDup(
      data?.map((schedule) => schedule.media) || [],
      "id"
    );
  }, [data, isLoading]);

  return {
    data: mediaList,
    isLoading,
    ...rest,
  };
};

export default useAnime4K;
