import { AiTitles, ExperimentAnimeTitles } from "../../types/animettv";
import axios from "axios";
import { Media, MediaCoverImage, MediaTitle } from "@/types/anilist";
import config from "next/config";

const ANIMETTV_SERVER_URL = process.env.NEXT_PUBLIC_ANIMETTV_SERVER_URL;

export const animettvFetcher = async(apiRoute:string) => {
    const { data } = await axios.get<any[]>(ANIMETTV_SERVER_URL+apiRoute);
    return data;
};

/* 
    Please don't judge me, I was too lazy to implement it in the backend
    this keeps support for legacy website to use same endpoint
*/
export const getAiTitles = async () => {
    const response = await animettvFetcher(
        "/api/watch-anime/anime60fps-available-titles",
    );

    // transpose data to different ai types
    let _AiHentai:ExperimentAnimeTitles[] = [];
    let _Ai60fps:ExperimentAnimeTitles[] = [];
    let _Ai4k:ExperimentAnimeTitles[] = [];
    let _AiRemastered: ExperimentAnimeTitles[] = [];

    response.forEach(el => {
        if (el?.isRemastered === false && el?.quality === 'hd' && el?.isNSFW === false) {
            _Ai60fps.push(el);
        } else if (el?.isRemastered === false && el?.quality === 'hd' && el?.isNSFW ) {
            _AiHentai.push(el);
        } else if (el?.quality === '4k') {
            _Ai4k.push(el);
        } else if (el?.isRemastered === true) {
            _AiRemastered.push(el);
        }
    })


    let data: AiTitles = {
        Ai4k : _Ai4k,
        Ai60fps : _Ai60fps,
        AiHentai : _AiHentai,
        AiRemastered : _AiRemastered,
    }
    
    return data;
}