import { ExperimentAnimeTitles } from "@/types/index";
import axios, { AxiosError } from "axios";
import { useQuery, UseQueryOptions } from "react-query";

const useAiTitles = () => {
  return getAllAvailableAiTitles();
};


async function getAllAvailableAiTitles(): Promise<void> {
    const { data } = await axios.get(process.env.ANIMETTV_SERVER_URL+"api/watch-anime/anime60fps-available-titles");
    Promise.resolve(data);
}

export default useAiTitles;
