import {
  TMDBWatchProvider,
  WatchProviderResult,
  getWatchProvidersByTitle,
} from "@/services/tmdb";
import { Media } from "@/types/anilist";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import Image from "next/image";
import { getProviderBaseUrl, getProviderLogo } from "@/utils/provider";
import Link from "next/link";

interface WatchProviderProps {
  media: Media;
}

const WatchProvider: React.FC<WatchProviderProps> = ({ media }) => {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const [watchProviderData, setWatchProviderData] =
    useState<WatchProviderResult | null>(null);
  const [hoveredElement, setHoveredElement] = useState(null);

  const handleMouseEnter = (providerId) => {
    setHoveredElement(providerId);
  };

  const handleMouseLeave = () => {
    setHoveredElement(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await getWatchProvidersByTitle(media, currentLanguage);

      setWatchProviderData(result);
    };

    fetchData();

    console.log(media.trailer?.site);
    
    
  }, [currentLanguage, media]);

  if (!watchProviderData) {
    return null; // Return nothing if data is null
  }

  const renderWatchProviders = (
    providers: TMDBWatchProvider[],
    type: string
  ) => (
    <div className="mb-4">
      <h2 className="text-[var(--step-0)] font-semibold">{type}</h2>
      <div className="flex flex-row flex-wrap flex-start">
        {providers?.map((provider) => (
          <div
            key={provider.provider_id}
            className="mx-2 my-2 flex flex-start relative cursor-pointer"
            onMouseEnter={() => handleMouseEnter(provider.provider_id)}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex items-center flex-col">
              {provider.logo_path && getProviderBaseUrl(provider.provider_id) && (
                <Link
                  href={getProviderBaseUrl(provider.provider_id)}
                >
                  <a target="_blank">
                    <Image
                      src={getProviderLogo(provider.provider_id)}
                      alt={provider.provider_name}
                      width={55}
                      height={55}
                      className="rounded-sm"
                    />
                  </a>
                </Link>
              )}
            </div>
            {hoveredElement === provider.provider_id && (
              <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 p-2 px-4 bg-neutral-800 text-white [font-size:var(--step--2)] rounded opacity-90 cursor-pointer">
                {provider.provider_name}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-neutral-900 px-3 py-1">
      {watchProviderData.rent?.length > 0 &&
        renderWatchProviders(watchProviderData.rent, "Rent")}
      {watchProviderData.buy?.length > 0 &&
        renderWatchProviders(watchProviderData.buy, "Buy")}
      {watchProviderData.flatrate?.length > 0 &&
        renderWatchProviders(watchProviderData.flatrate, "Subscription")}
    </div>
  );
};

export default WatchProvider;
