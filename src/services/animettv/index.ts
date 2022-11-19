import { ExperimentAnimeTitles } from "../../types/index";
import axios from "axios";

const ANIMETTV_SERVER_URL = "http://localhost:3011";

export const animettvFetcher = async(apiRoute:string) => {
    const { data } = await axios.get<any[]>(ANIMETTV_SERVER_URL+apiRoute);
    return data;
};

export const getAiTitles = async () => {
    const response = await animettvFetcher(
        "/api/watch-anime/anime60fps-available-titles",
    );
        
    return response;
}