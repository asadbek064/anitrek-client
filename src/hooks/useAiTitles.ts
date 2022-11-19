import { getAiTitles } from "@/services/animettv";
import { ExperimentAnimeTitles } from "@/types/index";
import axios, { AxiosError } from "axios";
import { useQuery, UseQueryOptions } from "react-query";

const useAiTitles = (
  options?: Omit<UseQueryOptions<AxiosError, ExperimentAnimeTitles[]>, "queryKey" | "queryFn">) => {
  return useQuery<ExperimentAnimeTitles[]>(
    [],
    () => {
      return getAiTitles();
    }
  );
};

export default useAiTitles;


