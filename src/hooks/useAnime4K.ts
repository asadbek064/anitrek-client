import { isMobile } from "react-device-detect";
import useAiTitles from "./useAiTitles";
import {ExperimentAnimeTitles} from '@/types/index';
import { useMemo } from "react";

const useAnime4K = () => {
  const { data, isLoading, ...res  } = useAiTitles();
  let ultrahd_titles: ExperimentAnimeTitles[] = [];

  const mediaList = useMemo(() => {
    if (isLoading) return null;
    
    console.log(data);
    return data;
  }, [data, isLoading]);

  
  return {
    data: mediaList,
    isLoading,
    ...res
  }
};

export default useAnime4K;


