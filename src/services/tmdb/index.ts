import { Translation } from "@/types";
import { Media, MediaFormat } from "@/types/anilist";
import { localeToCountryCode } from "@/utils/local";
import axios from "axios";

export declare module TMDBSearch {
  export interface KnownFor {
    backdrop_path: string;
    first_air_date: string;
    genre_ids: number[];
    id: number;
    media_type: string;
    name: string;
    origin_country: string[];
    original_language: string;
    original_name: string;
    overview: string;
    poster_path: string;
    vote_average: number;
    vote_count: number;
    adult?: boolean;
    original_title: string;
    release_date: string;
    title: string;
    video?: boolean;
  }

  export interface Result {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    media_type: string;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    gender?: number;
    known_for: KnownFor[];
    known_for_department: string;
    name: string;
    profile_path: string;
    first_air_date: string;
    origin_country: string[];
    original_name: string;
  }

  export interface Response {
    page: number;
    results: Result[];
    total_pages: number;
    total_results: number;
  }
}

export declare module TMDBTranlations {
  export interface Data {
    name: string;
    overview: string;
    homepage: string;
    tagline: string;
    title: string;
  }

  export interface Translation {
    iso_3166_1: string;
    iso_639_1: string;
    name: string;
    english_name: string;
    data: Data;
  }

  export interface Response {
    id: number;
    translations: Translation[];
  }
}

export interface episodeDetail {
  title: string;
  description: string;
  image: string;
  episodeNumber: number;

}

export interface TMDBWatchProvider {
  link: string;
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
}

interface TMDBWatchProvidersResponse {
  results: {
    [key: string]: {
      link: string;
      rent: TMDBWatchProvider[];
      buy: TMDBWatchProvider[];
      flatrate: TMDBWatchProvider[];
    };
  };
  
}

export interface WatchProviderResult {
  link?: string;
  rent?: TMDBWatchProvider[];
  buy?: TMDBWatchProvider[];
  flatrate?: TMDBWatchProvider[];
}

const TMDB_KEY = "eec5310a93f4ed5ba78175354e22f18c";

const client = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: TMDB_KEY,
  },
});

export const search = async (keyword: string, type: "movie" | "tv") => {
  const { data } = await client.get<TMDBSearch.Response>(`/search/${type}`, {
    params: { language: "en-US", query: keyword, page: 1, include_adult: true },
  });

  if (!data?.results?.length) return null;
  
  return data.results[0];
};

//https://api.themoviedb.org/3/tv/1399/season/1/episode/1/images?api_key=eec5310a93f4ed5ba78175354e22f18c

export const getTranslations = async (media: Media): Promise<Translation[]> => {
  const type = media.format === MediaFormat.Movie ? "movie" : "tv";

  const searchResult = await search(
    media.title.native || media.title.userPreferred,
    type
  );

  if (!searchResult) return [];

  const { data } = await client.get<TMDBTranlations.Response>(
    `/${type}/${searchResult.id}/translations`
  );


  return data.translations.map((trans) => ({
    locale: trans.iso_639_1,
    description: trans.data.overview,
    title: trans.data.title || trans.data.name,
  }));
};

export const getWatchProviders = async (id: number, type: 'movie' | 'tv'): Promise<TMDBWatchProvidersResponse | null> => {
  try {
    const { data } = await client.get<TMDBWatchProvidersResponse>(`/${type}/${id}/watch/providers`, {
      params: {
        language: 'en-US',
      },
    });

    return data;
  } catch (error) {
    console.error('Error fetching watch providers:', error);
    return null;
  }
};


export const getWatchProvidersByTitle = async (media: Media, local:string): Promise<WatchProviderResult | null> => {
  try {
    const type = media.format === MediaFormat.Movie ? "movie" : "tv";
    console.log(type);
    
    const result = await search(media.title.romaji, type);
    const country = localeToCountryCode(local.toUpperCase());
    
    if (result) {
      const details = await getWatchProviders(result.id, type);
      if (details) {
        console.log(details.results[country]);
        
       return details.results[country];
      }
    }
  } catch (error) {
    return null;
  }
}