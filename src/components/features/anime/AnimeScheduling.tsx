import CardSwiper from "@/components/shared/CardSwiper";
import DotList from "@/components/shared/DotList";
import Loading from "@/components/shared/Loading";
import SwiperCard from "@/components/shared/SwiperCard";
import useAiringSchedules from "@/hooks/useAiringSchedules";
import useConstantTranslation from "@/hooks/useConstantTranslation";
import dayjs from "@/lib/dayjs";
import { AiringSchedule, AiringSort } from "@/types/anilist";
import { removeArrayOfObjectDup } from "@/utils";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import React, { useState } from "react";
import { isMobile } from "react-device-detect";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";

interface AnimeSchedulingProps {}

const AnimeScheduling: React.FC<AnimeSchedulingProps> = () => {
  const { t } = useTranslation("anime_home");
  const { DAYSOFWEEK } = useConstantTranslation();

  const today = dayjs();
  const todayIndex = today.day();

  // dayjs current date month
  const currentMonth = today.format("MM/DD/YYYY");
// dayjs get current time am pm
  const currentAMPM = today.format("A");

  // create nextjs current time counter
  const [currentTime, setCurrentTime] = useState(dayjs().unix());
  // set current time every second
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs().unix());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  
  const [selectedTab, setSelectedTab] = useState(todayIndex);

  const selectedDayOfWeek = dayjs().day(selectedTab);

  const { data: schedules, isLoading: schedulesLoading } = useAiringSchedules({
    airingAt_greater: selectedDayOfWeek.startOf("day").unix(),
    airingAt_lesser: selectedDayOfWeek.endOf("day").unix(),
    perPage: isMobile ? 10 : 20,
    sort: [AiringSort.Time_desc],
  });

  const handleTabSelect = (index) => {
    setSelectedTab(index);
  };

  return (
    <Tabs
      onSelect={handleTabSelect}
      defaultIndex={todayIndex}
      selectedTabClassName="bg-white !text-black"
    >
      <div className="opacity-60 text-center text-md font-bold py-2 tracking-wide flex ">
        Now: {currentMonth}&nbsp;
        <div>
        {dayjs.unix(currentTime).format("HH:mm:ss")} {currentAMPM}
        </div> 
      </div>
      <TabList className="w-5/6 mx-auto flex items-center justify-center flex-wrap gap-x-4 lg:gap-x-8 ">
        {DAYSOFWEEK.map((day, index) => {
          const isToday = todayIndex === index;

          return (
            <Tab
              key={day}
              className={classNames(
                "px-4 py-2 rounded-[5px] cursor-pointer hover:bg-white hover:text-black transition duration-250",
                isToday && "text-primary-500"
              )}
            >
              {day}
            </Tab>
          );
        })}
      </TabList>

      <div className="mt-20">
        {DAYSOFWEEK.map((day) => {
          return (
            <TabPanel key={day}>
              {schedulesLoading ? (
                <div className="relative h-6 w-full">
                  <Loading />
                </div>
              ) : !schedules?.length ? (
                <p className="text-2xl text-center">Not available...</p>
              ) : (
                <CardSwiper
                  data={removeArrayOfObjectDup(
                    schedules.map((schedule: AiringSchedule) => schedule.media),
                    "id"
                  )}
                  onEachCard={(card, isExpanded) => {
                    const cardWithSchedule = schedules.find(
                      (schedule) => schedule.media.id === card.id
                    );

                    const isReleased = dayjs
                      .unix(cardWithSchedule.airingAt)
                      .isBefore(dayjs());

                    return (
                      <SwiperCard
                        isExpanded={isExpanded}
                        data={card}
                        containerEndSlot={
                          <DotList>
                            <span>
                              {t("common:episode")} {cardWithSchedule.episode}
                            </span>
                            <span>
                              {!isReleased
                                ? dayjs
                                    .unix(cardWithSchedule.airingAt)
                                    .format("hh:mm a")
                                : t("airing_schedule_passed")}
                            </span>
                          </DotList>
                        }
                      />
                    );
                  }}
                />
              )}
            </TabPanel>
          );
        })}
      </div>
    </Tabs>
  );
};

export default AnimeScheduling;
