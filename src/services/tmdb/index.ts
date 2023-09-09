import { Translation } from "@/types";
import { Media, MediaFormat } from "@/types/anilist";
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


// Define the WatchProvider type based on the expected data structure
interface WatchProvider {
  providerId: string;
  providerName: string;
  link: string;
}

// Define the TMDBWatchProviders type based on the expected data structure from TMDB API
namespace TMDBWatchProviders {
  export interface Response {
    results: {
      [countryCode: string]: {
        link: string;
        buy: Array<WatchProvider>;
        rent: Array<WatchProvider>;
        flatrate: Array<WatchProvider>;
      };
    };
  }
}



/* export const getWatchProviders = async (media: Media): Promise<WatchProvider[]> => {
  const type = media.format === MediaFormat.Movie ? "movie" : "tv";

  const { data } = await client.get<TMDBWatchProviders.Response>(
    `/${type}/${media}/watch/providers`
  );
  

  const watchProviders = data.results.US; // You can adjust the country code as needed.

  return null;
};
 */