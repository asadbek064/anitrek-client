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
import crypto from "crypto";
import { cacheGet, cacheSet } from "@/lib/redis";
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

const GRAPHQL_URL = "https://graphql.anilist.co";
const PROXY_URL = process.env.NEXT_PUBLIC_PROXY_SERVER_URL;
const AVAILABLE_WORKER_URL = `${process.env.NEXT_PUBLIC_NODE_SERVER_URL}/available-worker`;

// Cache TTL configurations (in seconds)
// Optimized for free tier: 500K commands/month, 256 MB storage
const CACHE_TTL = {
  MEDIA_LIST: 600,        // 10 minutes for media lists (popular pages)
  MEDIA_DETAILS: 3600,    // 1 hour for media details (most viewed content)
  AIRING_SCHEDULE: 300,   // 5 minutes for airing schedules (changes often)
  CHARACTER: 7200,        // 2 hours for character data (rarely changes)
  STAFF: 7200,            // 2 hours for staff data (rarely changes)
  STUDIO: 14400,          // 4 hours for studio data (very stable)
};

// Generate cache key from query and variables
const generateCacheKey = (query: string, variables: any): string => {
  const hash = crypto
    .createHash('md5')
    .update(query + JSON.stringify(variables))
    .digest('hex');
  return `anilist:${hash}`;
};

export const anilistFetcher = async <T>(
  query: string,
  variables: any,
  cacheTTL?: number
) => {
  type Response = {
    data: T;
  };

  // Try to get from cache first (server-side only)
  if (typeof window === 'undefined' && cacheTTL) {
    const cacheKey = generateCacheKey(query, variables);
    const cached = await cacheGet<T>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  let responseData: T | undefined;

  // If we have a proxy URL configured, use it directly (browser-side)
  if (PROXY_URL && typeof window !== 'undefined') {
    try {
      const response = await axios.post<Response>(
        `${PROXY_URL}/${GRAPHQL_URL}`,
        {
          query,
          variables,
        },
        {
          timeout: 10000, // 10 second timeout
        }
      );
      responseData = response.data?.data;
    } catch (proxyError) {
      console.error('Proxy request failed:', proxyError);
      // Fall through to worker proxy
    }
  }

  // Make the request if not already fetched from proxy
  if (!responseData) {
    try {
      // Make the initial request (server-side or if no proxy configured)
      const initialResponse = await axios.post<Response>(
        GRAPHQL_URL,
        {
          query,
          variables,
        },
        {
          timeout: 10000, // 10 second timeout
        }
      );

      responseData = initialResponse.data?.data;

    } catch (error) {
      // Only try worker proxy if we have the URL configured
      if (!AVAILABLE_WORKER_URL || !process.env.NEXT_PUBLIC_NODE_SERVER_URL) {
        console.error('AniList request failed and no worker proxy configured');
        throw error;
      }

      try {
        console.log('proxy worker in use');
        // Fetch the new available worker URL
        const response = await axios.get<{ urlId: string }>(
          AVAILABLE_WORKER_URL,
          {
            timeout: 5000, // 5 second timeout for worker check
          }
        );
        const newUrl = response.data.urlId;

        if (!newUrl) {
          throw new Error('Worker proxy returned invalid URL');
        }

        // Retry the original request with the new URL
        const retryResponse = await axios.post<Response>(
          `https://${newUrl}/${GRAPHQL_URL}`,
          {
            query,
            variables,
          },
          {
            timeout: 10000, // 10 second timeout
          }
        );

        responseData = retryResponse.data?.data;
      } catch (workerError) {
        console.error('Worker proxy failed:', workerError);
        // Don't retry again - throw the error
        throw workerError;
      }
    }
  }

  // Cache the response (server-side only)
  if (typeof window === 'undefined' && cacheTTL && responseData) {
    const cacheKey = generateCacheKey(query, variables);
    await cacheSet(cacheKey, responseData, cacheTTL);
  }

  return responseData;
};

export const getPageMedia = async (
  args: MediaArgs & PageArgs,
  fields?: string
) => {
  const response = await anilistFetcher<PageQueryResponse>(
    mediaQuery(fields),
    args,
    CACHE_TTL.MEDIA_LIST
  );

  return response?.Page;
};

export const getMedia = async (args: MediaArgs & PageArgs, fields?: string) => {
  const response = await anilistFetcher<PageQueryResponse>(
    mediaQuery(fields),
    args,
    CACHE_TTL.MEDIA_LIST
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
    args,
    CACHE_TTL.MEDIA_DETAILS
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
    args,
    CACHE_TTL.AIRING_SCHEDULE
  );

  return response?.Page.airingSchedules;
};

export const getRecommendations = async (
  args: RecommendationArgs & PageArgs,
  fields?: string
) => {
  const response = await anilistFetcher<PageQueryResponse>(
    recommendationsQuery(fields),
    args,
    CACHE_TTL.MEDIA_LIST
  );

  return response?.Page.recommendations;
};

export const getAllAiringSchedules = async (
  args: PageArgs & AiringScheduleArgs,
  fields?: string
) => {
  let list: AiringSchedule[] = [];
  let page = 1;
  const MAX_PAGES = 10; // Prevent infinite loops - max 10 pages

  const fetch = async () => {
    // Safety check: prevent infinite loops
    if (page > MAX_PAGES) {
      console.warn(`getAllAiringSchedules: Reached max page limit (${MAX_PAGES})`);
      return;
    }

    const response = await anilistFetcher<PageQueryResponse>(
      airingSchedulesQuery(fields),
      { ...args, page },
      CACHE_TTL.AIRING_SCHEDULE
    );

    // Safety check: ensure response is valid
    if (!response?.Page?.airingSchedules) {
      console.warn('getAllAiringSchedules: Invalid response, stopping pagination');
      return;
    }

    list = list.concat(response.Page.airingSchedules);

    if (response.Page.pageInfo?.hasNextPage && page < MAX_PAGES) {
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
    args,
    CACHE_TTL.CHARACTER
  );

  return response?.Page.characters;
};

export const getPageCharacters = async (
  args: PageArgs & CharacterArgs,
  fields?: string
) => {
  const response = await anilistFetcher<PageQueryResponse>(
    charactersQuery(fields),
    args,
    CACHE_TTL.CHARACTER
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
    { ...args, perPage: 1 },
    CACHE_TTL.CHARACTER
  );

  return response?.Page.characters[0];
};

export const getStaff = async (args: PageArgs & StaffArgs, fields?: string) => {
  const response = await anilistFetcher<PageQueryResponse>(
    staffQuery(fields),
    args,
    CACHE_TTL.STAFF
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
    { ...args, perPage: 1 },
    CACHE_TTL.STAFF
  );

  return response?.Page.staff[0];
};

export const getPageStaff = async (
  args: PageArgs & StaffArgs,
  fields?: string
) => {
  const response = await anilistFetcher<PageQueryResponse>(
    staffQuery(fields),
    args,
    CACHE_TTL.STAFF
  );

  return response?.Page;
};

export const getStudios = async (
  args: PageArgs & StudioArgs,
  fields?: string
) => {
  const response = await anilistFetcher<PageQueryResponse>(
    studiosQuery(fields),
    args,
    CACHE_TTL.STUDIO
  );

  return response?.Page.studios;
};

export const getPageStudios = async (
  args: PageArgs & StudioArgs,
  fields?: string
) => {
  const response = await anilistFetcher<PageQueryResponse>(
    studiosQuery(fields),
    args,
    CACHE_TTL.STUDIO
  );

  return response?.Page;
};

export const getStudioDetails = async (
  args: PageArgs & StudioArgs,
  fields?: string
) => {
  const response = await anilistFetcher<StudioDetailsQueryResponse>(
    studioDetailsQuery(fields),
    args,
    CACHE_TTL.STUDIO
  );

  return response?.Studio;
};
