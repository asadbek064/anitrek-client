import { ExperimentAnimeTitles } from "@/types/index";
import axios, { AxiosError } from "axios";
import { useQuery, UseQueryOptions } from "react-query";

const useAiTitles = () => {
  return getAllAvailableAiTitles();
};


async function getAllAvailableAiTitles(): Promise<ExperimentAnimeTitles[]> {
    const { data } = await axios.get("http://localhost:3011/api/watch-anime/anime60fps-available-titles");
    if (data) {
      Promise.resolve(data);
    } 
    return [];
}

export default useAiTitles;
