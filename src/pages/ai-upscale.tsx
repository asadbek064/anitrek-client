import CardSwiper from "@/components/shared/CardSwiper";
import ClientOnly from "@/components/shared/ClientOnly";
import AiGallery from "@/components/shared/AiGallery";
import Head from "@/components/shared/Head";
import HomeBanner from "@/components/shared/HomeBanner";
import Section from "@/components/shared/Section";
import ListSwiperSkeleton from "@/components/skeletons/ListSwiperSkeleton";
import useDevice from "@/hooks/useDevice";
import useMedia from "@/hooks/useMedia";
import useRecentlyUpdated from "@/hooks/useRecentlyUpdated";
import { MediaSort, MediaType } from "@/types/anilist";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { isMobile } from "react-device-detect";
import useAiTitles from "@/hooks/useAiTitles";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import useHorizontalScroll from "@/hooks/useHorizontalScroll";

const AiUpscale = () => {
  
  const { data: trendingAnime, isLoading: trendingLoading } = useMedia({
    type: MediaType.Anime,
    sort: [MediaSort.Trending_desc, MediaSort.Popularity_desc],
    perPage: isMobile ? 5 : 10,
  });


  const { isDesktop } = useDevice();
  const { t } = useTranslation();

  const tabContainerRef = React.useRef<HTMLElement>(null);

  const handleTabSelect = () => {
    tabContainerRef.current.scrollTop = 0;
  };

  const ref = useHorizontalScroll<HTMLDivElement>();

  const { data: aiTitles, isLoading: aiTitlesLoading } = useAiTitles();

  return (
    <React.Fragment>
      <Head
        title="Watch Anime - AnimetTV"
        description="Watch anime online in high quality for free. Watch anime subbed, anime dubbed online free. Update daily, fast streaming, no ads, no registration"
      />

      <ClientOnly>
        <div className="pb-8">
          {/* <HomeBanner data={trendingAnime} isLoading={trendingLoading} />
           */}
          <div className="space-y-8 mt-14 md:mt-24">

              <div className="flex flex-col items-center mt-6">
                <Tabs 
                  domRef={(node) => (tabContainerRef.current = node)}
                  onSelect={handleTabSelect}
                  forceRenderTabPanel
                  selectedTabClassName="bg-background-700 border-b border-primary-500"
                  selectedTabPanelClassName="!block"
                >
                  <div className="p-2 bg-background-800">
                    <TabList className="">
                      <div
                        ref={ref}
                        className="flex items-center gap-2 overflow-x-scroll no-scrollbar"
                      >
                        <Tab className="px-3 py-2 cursor-pointer text-xl font-bold">
                          4K UHD
                        </Tab>
                        <Tab className="px-3 py-2 cursor-pointer text-xl font-bold">
                          60FPS
                        </Tab>
                        <Tab className="px-3 py-2 cursor-pointer text-xl font-bold">
                          Remastered
                        </Tab>
                      </div>
                    </TabList>
                  </div>
                  
                  <div className="py-2 grow overflow-x-hidden no-scrollbar">
                    <TabPanel className="hidden h-full p-2">
                      {aiTitlesLoading ? (
                        <ListSwiperSkeleton />
                      ) : (
                          <AiGallery images={aiTitles.Ai4k}/>
                      )}
                    
                    </TabPanel>

                    <TabPanel className="hidden h-full p-2">
                      {aiTitlesLoading ? (
                        <ListSwiperSkeleton />
                      ) : (
                        <AiGallery images={aiTitles.Ai60fps}/>
                      )}
                    </TabPanel>

                    <TabPanel className="hidden h-full p-2">    
                      {aiTitlesLoading ? (
                          <ListSwiperSkeleton />
                        ) : (
                          <AiGallery images={aiTitles.AiRemastered}/>
                        )}
                    </TabPanel>
                  </div>
                </Tabs>


              </div>
              

            <div
              className={classNames(
                "flex gap-8",
                isDesktop ? "flex-row" : "flex-col"
              )}
            ></div>
          </div>
        </div>
      </ClientOnly>
    </React.Fragment>
  );
};

export default AiUpscale;
