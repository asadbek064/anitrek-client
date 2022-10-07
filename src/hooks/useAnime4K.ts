import { isMobile } from "react-device-detect";
import useAiTitles from "./useAiTitles";
import {ExperimentAnimeTitles} from '@/types/index';

const useAnime4K = () => {
  const { ...data } = useAiTitles();
  let ultrahd_titles: ExperimentAnimeTitles[] = [];

  // filter data and selecte only 4k titles

  return {
    data
  };
};

export default useAnime4K;
