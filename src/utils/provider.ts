interface Provider { 
    provider_id: number;
    provider_name: string;
    base_url: string;
    provider_logo: string;
}

// List of providers
const providersList: Provider[] = [
    {
        provider_id: 8,
        provider_name: "Netflix",
        base_url: "https://www.netflix.com/",
        provider_logo: "/icons/provider_icon/netflix.png"
    },
    {
        provider_id: 1796,
        provider_name: "Netflix basic with Ads",
        base_url: "https://www.netflix.com/",
        provider_logo: "/icons/provider_icon/netflix_basic.png"
    },
    {
        provider_id: 9,
        provider_name: "Amazon Prime Video",
        base_url: "https://www.amazon.com/gp/video/genre/anime",
        provider_logo: "/icons/provider_icon/amazon_prime_video.png"
    },
    {
        provider_id: 15,
        provider_name: "Hulu",
        base_url: "https://www.hulu.com/hub/tv/collections/2619",
        provider_logo: "/icons/provider_icon/hulu.png"
    },
    {
        provider_id: 283,
        provider_name: "Crunchyroll",
        base_url: "https://www.crunchyroll.com/",
        provider_logo: "/icons/provider_icon/crunchyroll.png"
    },
    {
        provider_id: 269,
        provider_name: "Funimation Now",
        base_url: "https://www.funimation.com/",
        provider_logo: "/icons/provider_icon/funimation.png"
    },
    {
        provider_id: 10,
        provider_name: "Amazon Video",
        base_url: "https://www.amazon.com/gp/video/storefront",
        provider_logo: "/icons/provider_icon/amazon_video.png"
    },
    {
        provider_id: 3,
        provider_name: "Google Play Movies",
        base_url: "https://play.google.com/store/movies",
        provider_logo: "/icons/provider_icon/google_play_store.png"
    },
    {
        provider_id: 3,
        provider_name: "Crunchyroll basic with Ads",
        base_url: "https://www.crunchyroll.com/",
        provider_logo: "/icons/provider_icon/crunchyroll.png"
    },
    {
        provider_id: 7,
        provider_name: "Vudu",
        base_url: "https://www.vudu.com/",
        provider_logo: "/icons/provider_icon/vudu.png"
    },
    {
        provider_id: 2,
        provider_name: "Apple TV",
        base_url: "https://tv.apple.com/",
        provider_logo: "/icons/provider_icon/apple_tv.png"
    },
    {
        provider_id: 430,
        provider_name: "HiDive",
        base_url: "https://www.hidive.com/tv/",
        provider_logo: "/icons/provider_icon/hidiv.png"
    },
];


export const getProviderLogo = (provider_id: number) =>{
    for (let i = 0; i < providersList.length; i++) {
        if (providersList[i].provider_id === provider_id) {
            return providersList[i].provider_logo;
        }
    }
}

export const getProviderBaseUrl = (provider_id: number) =>{
    for (let i = 0; i < providersList.length; i++) {
        if (providersList[i].provider_id === provider_id) {
            return providersList[i].base_url;
        }
    }
}