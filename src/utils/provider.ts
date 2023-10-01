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
        provider_logo: "https://f002.backblazeb2.com/file/anitrek/provider_icons/netflix.png"
    },
    {
        provider_id: 1796,
        provider_name: "Netflix basic with Ads",
        base_url: "https://www.netflix.com/",
        provider_logo: "https://f002.backblazeb2.com/file/anitrek/provider_icons/netflix_basic.png"
    },
    {
        provider_id: 9,
        provider_name: "Amazon Prime Video",
        base_url: "https://www.amazon.com/gp/video/genre/anime",
        provider_logo: "https://f002.backblazeb2.com/file/anitrek/provider_icons/amazon_prime_video.png"
    },
    {
        provider_id: 15,
        provider_name: "Hulu",
        base_url: "https://www.hulu.com/hub/tv/collections/2619",
        provider_logo: "https://f002.backblazeb2.com/file/anitrek/provider_icons/hulu.png"
    },
    {
        provider_id: 283,
        provider_name: "Crunchyroll",
        base_url: "https://www.crunchyroll.com/",
        provider_logo: "https://f002.backblazeb2.com/file/anitrek/provider_icons/crunchyroll.png"
    },
    {
        provider_id: 269,
        provider_name: "Funimation Now",
        base_url: "https://www.funimation.com/",
        provider_logo: "https://f002.backblazeb2.com/file/anitrek/provider_icons/funimation.png"
    },
    {
        provider_id: 10,
        provider_name: "Amazon Video",
        base_url: "https://www.amazon.com/gp/video/storefront",
        provider_logo: "https://f002.backblazeb2.com/file/anitrek/provider_icons/amazon_video.png"
    },
    {
        provider_id: 3,
        provider_name: "Google Play Movies",
        base_url: "https://play.google.com/store/movies",
        provider_logo: "https://f002.backblazeb2.com/file/anitrek/provider_icons/google_play_store.png"
    },
    {
        provider_id: 3,
        provider_name: "Crunchyroll basic with Ads",
        base_url: "https://www.crunchyroll.com/",
        provider_logo: "https://f002.backblazeb2.com/file/anitrek/provider_icons/crunchyroll.png"
    },
    {
        provider_id: 7,
        provider_name: "Vudu",
        base_url: "https://www.vudu.com/",
        provider_logo: "https://f002.backblazeb2.com/file/anitrek/provider_icons/vudu.png"
    },
    {
        provider_id: 2,
        provider_name: "Apple TV",
        base_url: "https://tv.apple.com/",
        provider_logo: "https://f002.backblazeb2.com/file/anitrek/provider_icons/apple_tv.png"
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