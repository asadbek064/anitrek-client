import { getAiTitles } from "@/services/animettv";
import { ExperimentAnimeTitles } from "@/types/index";
import axios, { AxiosError } from "axios";
import { useQuery, UseQueryOptions } from "react-query";

const useAiTitles = (
  args?: ExperimentAnimeTitles,
  options?: Omit<UseQueryOptions<AxiosError, ExperimentAnimeTitles[]>, "queryKey" | "queryFn">) => {
  return useQuery<ExperimentAnimeTitles[]>(
    [{args}],
    () => {
      return getAiTitles();
    }
  );
};

export default useAiTitles;


