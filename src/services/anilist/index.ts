import { Translation } from "@/types";
import {
  AiringSchedule,
  AiringScheduleArgs,
  CharacterArgs,
  MediaArgs,
  MediaType,
  PageArgs,
  RecommendationArgs,
  StaffArgs,
  StudioArgs,
} from "@/types/anilist";
import { removeArrayOfObjectDup } from "@/utils";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";
import { getTranslations } from "../tmdb";
import {
  airingSchedulesQuery,
  charactersDefaultFields,
  charactersQuery,
  mediaDefaultFields,
  mediaDetailsQuery,
  MediaDetailsQueryResponse,
  mediaQuery,
  PageQueryResponse,
  recommendationsQuery,
  staffDefaultFields,
  staffQuery,
  studioDetailsQuery,
  StudioDetailsQueryResponse,
  studiosQuery,
} from "./queries";
import dayjs from "@/lib/dayjs";

const GRAPHQL_URL = "https://graphql.anilist.co";
const AVAILABLE_WORKER_URL = `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}/available-worker`;

const fetchFromApi = async (method: string, key: string, value?: any) => {
  const url = `/api/redis?key=${key}`;

  try{
    if (method === 'GET') {
      const response = await axios.get(url);
      return response.data;
    } else if (method === 'PUT') {
      const response = await axios.put(url, { key, value });
      return response.data;
    }
  } catch(error) {
    return false;
  }
};

const simpleHash = str => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
  }
  // Convert to 32bit unsigned integer in base 36 and pad with "0" to ensure length is 7.
  return (hash >>> 0).toString(36).padStart(7, '0');
};

export const anilistFetcher = async <T>(query: string, variables: any) => {
  type Response = {
    data: T;
  };

  const clonedVariables = JSON.parse(JSON.stringify(variables));

  if (clonedVariables.airingAt_lesser) {
    let date = dayjs.unix(clonedVariables.airingAt_lesser);
    clonedVariables.airingAt_lesser = date;
  }

  const cacheKey = `${simpleHash(JSON.stringify(variables))}`;

  try {
    // Check cache first
    const cacheResponse = await fetchFromApi('GET', cacheKey);


    if (cacheResponse !== false) {
      // @ts-ignore
      return JSON.parse(cacheResponse.value);
    }
    // Make the initial request
    const initialResponse = await axios.post<Response>(GRAPHQL_URL, {
      query,
      variables,
    });

    const data = initialResponse.data?.data;

    console.log('cache missed fetching fresh and saving to cache');
    
    // Cache the response
    await fetchFromApi('PUT', cacheKey, data);

    return data;

  } catch (error) {
      console.log('proxy worker in use \N');
      
      // Fetch the new available worker URL
      const response = await axios.get<{ urlId: string }>(AVAILABLE_WORKER_URL);
      const newUrl = response.data.urlId;

      // Retry the original request with the new URL
      const retryResponse = await axios.post<Response>(`https://${newUrl}/${GRAPHQL_URL}`, {
        query,
        variables,
      });

      if (retryResponse.status === 200) {
        // Cache the response
        await fetchFromApi('PUT', cacheKey, retryResponse.data?.data);
      }

      // Return the data from the retry attempt
      return retryResponse.data?.data;
  }
};

export const getPageMedia = async (
  args: MediaArgs & PageArgs,
  fields?: string
) => {
  const response = await anilistFetcher<PageQueryResponse>(
    mediaQuery(fields),
    args
  );

  return response?.Page;
};

export const getMedia = async (args: MediaArgs & PageArgs, fields?: string) => {
  const response = await anilistFetcher<PageQueryResponse>(
    mediaQuery(fields),
    args
  );

  const mediaList = response?.Page?.media || [];

  const mediaIdList = mediaList.map((media) => media.id);

  const { data: mediaTranslations, error } = await supabaseClient
    .from<Translation>("kaguya_translations")
    .select("*")
    .in("mediaId", mediaIdList);

  if (error || !mediaTranslations?.length) return mediaList;
  
  return mediaList.map((media) => {
    const translations = mediaTranslations.filter(
      (trans) => trans.mediaId === media.id
    );

    return {
      ...media,
      translations,
    };
  });
};

export const getMediaDetails = async (
  args: MediaArgs & PageArgs,
  fields?: string
) => {
  const response = await anilistFetcher<MediaDetailsQueryResponse>(
    mediaDetailsQuery(fields),
    args
  );

  let translations: Translation[] = [];
  const media = response?.Media;
  
  
  const { data } = await supabaseClient
    .from<Translation>("kaguya_translations")
    .select("*")
    .eq("mediaId", media.id)
    .eq("mediaType", args?.type || MediaType.Anime);

  if (data?.length) {
    translations = data;
  } else if (args?.type === MediaType.Manga) {
    translations = null;
  } else {
    translations = await getTranslations(media);
    if (translations) {
      translations = translations.map(translation => ({
        ...translation,
        title: translation.title === undefined ? null : translation.title,
      }));
    }
  }

  return {
    ...media,
    translations: translations ? translations: null,
  };
};

export const getAiringSchedules = async (
  args: AiringScheduleArgs & PageArgs,
  fields?: string
) => {
  const response = await anilistFetcher<PageQueryResponse>(
    airingSchedulesQuery(fields),
    args
  );

  return response?.Page.airingSchedules;
};

export const getRecommendations = async (
  args: RecommendationArgs & PageArgs,
  fields?: string
) => {
  const response = await anilistFetcher<PageQueryResponse>(
    recommendationsQuery(fields),
    args
  );

  return response?.Page.recommendations;
};

export const getAllAiringSchedules = async (
  args: PageArgs & AiringScheduleArgs,
  fields?: string
) => {
  let list: AiringSchedule[] = [];

  let page = 1;

  const fetch = async () => {
    const response = await anilistFetcher<PageQueryResponse>(
      airingSchedulesQuery(fields),
      { ...args, page }
    );

    list = list.concat(response?.Page.airingSchedules);

    if (response?.Page.pageInfo.hasNextPage) {
      page++;
      await fetch();
    }
  };

  await fetch();

  return removeArrayOfObjectDup(list, "mediaId");
};

export const getCharacters = async (
  args: PageArgs & CharacterArgs,
  fields?: string
) => {
  const response = await anilistFetcher<PageQueryResponse>(
    charactersQuery(fields),
    args
  );

  return response?.Page.characters;
};

export const getPageCharacters = async (
  args: PageArgs & CharacterArgs,
  fields?: string
) => {
  const response = await anilistFetcher<PageQueryResponse>(
    charactersQuery(fields),
    args
  );

  return response?.Page;
};

export const getCharacterDetails = async (
  args: PageArgs & CharacterArgs,
  fields?: string
) => {
  const defaultFields = `
    ${charactersDefaultFields}
    media {
      edges {
        node {
          ${mediaDefaultFields}
        }
        voiceActors {
          ${staffDefaultFields}
        }
      }
    }
  `;

  const response = await anilistFetcher<PageQueryResponse>(
    charactersQuery(fields || defaultFields),
    { ...args, perPage: 1 }
  );

  return response?.Page.characters[0];
};

export const getStaff = async (args: PageArgs & StaffArgs, fields?: string) => {
  const response = await anilistFetcher<PageQueryResponse>(
    staffQuery(fields),
    args
  );

  return response?.Page.staff;
};

export const getStaffDetails = async (
  args: PageArgs & StaffArgs,
  fields?: string
) => {
  const defaultFields = `
    ${staffDefaultFields}
    characters {
      nodes {
        ${charactersDefaultFields}
      }
    }
  `;

  const response = await anilistFetcher<PageQueryResponse>(
    staffQuery(fields || defaultFields),
    { ...args, perPage: 1 }
  );

  return response?.Page.staff[0];
};

export const getPageStaff = async (
  args: PageArgs & StaffArgs,
  fields?: string
) => {
  const response = await anilistFetcher<PageQueryResponse>(
    staffQuery(fields),
    args
  );

  return response?.Page;
};

export const getStudios = async (
  args: PageArgs & StudioArgs,
  fields?: string
) => {
  const response = await anilistFetcher<PageQueryResponse>(
    studiosQuery(fields),
    args
  );

  return response?.Page.studios;
};

export const getPageStudios = async (
  args: PageArgs & StudioArgs,
  fields?: string
) => {
  const response = await anilistFetcher<PageQueryResponse>(
    studiosQuery(fields),
    args
  );

  return response?.Page;
};

export const getStudioDetails = async (
  args: PageArgs & StudioArgs,
  fields?: string
) => {
  const response = await anilistFetcher<StudioDetailsQueryResponse>(
    studioDetailsQuery(fields),
    args
  );

  return response?.Studio;
};
