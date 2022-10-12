import { ExperimentAnimeTitles } from "@/types";
import axios from "axios";
import { AiAvailableQueryResponse } from "./queries";

const ANIMETTV_SERVER_URL = "http://localhost:3011";

export const animettvFetcher = async <T>(apiRoute:string) => {
    type Response = {
        data: T;
    };

    const { data } = await axios.get<Response>(ANIMETTV_SERVER_URL+apiRoute);

    return data?.data;
};

export const getAiTitles = async () => {
    const response = await animettvFetcher<AiAvailableQueryResponse>(
        "/api/watch-anime/anime60fps-available-titles",
    );

    return response?.ExperimentAnimeTitles;
}