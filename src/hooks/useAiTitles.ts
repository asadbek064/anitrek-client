import { getAiTitles } from "@/services/animettv";
import { AiTitles, ExperimentAnimeTitles } from "@/types/animettv";
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


