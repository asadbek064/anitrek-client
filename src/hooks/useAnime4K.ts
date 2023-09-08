import { isMobile } from "react-device-detect";
import useAiTitles from "./useAiTitles";
import {ExperimentAnimeTitles} from '@/types/AniTrek';
import { useMemo } from "react";

const useAnime4K = () => {
  const { data, isLoading, ...res  } = useAiTitles();

  const mediaList = useMemo(() => {
    if (isLoading) return null;

    return data;
  }, [data, isLoading]);

  
  return {
    data: mediaList,
    isLoading,
    ...res
  }
};

export default useAnime4K;


