import { getAiTitles } from "@/services/AniTrek";
import { AiTitles } from "@/types/AniTrek";
import axios, { AxiosError } from "axios";
import { useQuery, UseQueryOptions } from "react-query";

const useAiTitles = (
  options?: Omit<UseQueryOptions<AxiosError, AiTitles>, "queryKey" | "queryFn">) => {
  return useQuery<AiTitles>(
    [],
    () => {
      return getAiTitles();
    }
  );
};

export default useAiTitles;


