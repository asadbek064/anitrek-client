import { AiTitles, ExperimentAnimeTitles } from "../../types/animettv";
import axios from "axios";
import { Media, MediaCoverImage, MediaTitle } from "@/types/anilist";

const ANIMETTV_SERVER_URL = process.env.NEXT_PUBLIC_NODE_SERVER_URL;

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
    
    // transpose data to media type
    let _MediaAi4k: Media[] = [];
    let _MediaAi60fps: Media[] = [];
    let _MediaAiHentai: Media[] = [];
    let _MediaAiRemastered: Media[] = [];

    ExperimentToMedia(_Ai4k, _MediaAi4k);
    ExperimentToMedia(_Ai60fps, _MediaAi60fps);
    ExperimentToMedia(_AiHentai, _MediaAiHentai);
    ExperimentToMedia(_AiRemastered, _MediaAiRemastered);

    let data: AiTitles = {
        Ai4k : _MediaAi4k,
        Ai60fps : _MediaAi60fps,
        AiHentai : _MediaAiHentai,
        AiRemastered : _MediaAiRemastered,
    }

    return data;
}

const ExperimentToMedia = (legacyArry:ExperimentAnimeTitles[], destinationArry: Media[]) => {
    legacyArry.forEach(el => {
        let _title: MediaTitle = {
            romaji: el.title,
            native: el.title,
            userPreferred: el.title,
            english: el.title
        }

        let _img: MediaCoverImage = {
            color:null,
            extraLarge: el.cover_img,
            large: el.cover_img,
            medium: el.cover_img
        }
        let mediaItem: Media = {
             /** The id of the media*/
            id: null,
            idMal: null,
            title: _title,
            type: null,
            format: null,
            status: null,
            description: null,
            startDate: null,
            endDate: null,
            season: null,
            seasonYear: null,
            seasonInt: null,
            episodes: null,
            duration: null,
            chapters: null,
            volumes: null,
            countryOfOrigin: null,
            isLicensed: null,
            source: null,
            hashtag: null,
            trailer: null,
            updatedAt: null,
            coverImage: _img,
            bannerImage: _img.extraLarge,
            genres: null,
            synonyms: null,
            averageScore: el.score,
            meanScore: el.score,
            popularity: null,
            isLocked: false,
            trending: null,
            favourites: null,
            tags: null,
            relations: null,
            characters: null,
            staff: null,
            studios: null,
            isFavourite: false,
            isFavouriteBlocked: null,
            isAdult: false,
            nextAiringEpisode: null,
            airingSchedule: null,
            trends: null,
            externalLinks: null,
            streamingEpisodes: null,
            rankings: null,
            mediaListEntry: null,
            recommendations: null,
            isReviewBlocked: false,
            siteUrl: null,
            autoCreateForumThread: null,
            isRecommendationBlocked: false,
            modNotes: null
        }

        destinationArry.push(mediaItem);
    });
}