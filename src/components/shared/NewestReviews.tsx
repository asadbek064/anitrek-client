import Avatar from "@/components/shared/Avatar";
import Section from "@/components/shared/Section";
import Swiper, { SwiperSlide } from "@/components/shared/Swiper";

import dayjs from "@/lib/dayjs";
import { MediaType } from "@/types/anilist";
import { createMediaDetailsUrl, createReviewDetailsUrl } from "@/utils";
import { getTitle } from "@/utils/data";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Editor from "../features/comment/Editor";
import CommentsSwiperSkeleton from "../skeletons/CommentsSwiperSkeleton";
import useNewestReviews from "@/hooks/useNewestReviews";
import { isMobile } from "react-device-detect";
import TextIcon from "./TextIcon";
import { AiFillLike, AiFillStar } from "react-icons/ai";

interface NewestReviewsProps {
  type: MediaType;
  homeView: boolean;
}

const NewestReviews: React.FC<NewestReviewsProps> = (props) => {
  const { data, isLoading } = useNewestReviews(props.type);
  const homeView = props.homeView || false;

  const { t } = useTranslation("common");
  const { locale } = useRouter();

  if (isLoading) {
    return <CommentsSwiperSkeleton />;
  }

  return data?.length ? (
    <>
      {homeView ? (
        <div>
          <Swiper
            direction={"horizontal"}
            hideNavigation
            slidesPerGroup={1}
            breakpoints={{
              1536: {
                slidesPerView: 6,
                spaceBetween: 20,
              },
              1280: {
                slidesPerView: 5,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 20,
              },

              0: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
            }}
          >
            {data.map(({ review, media, likeCount }) => {
              const user = review?.user;
              const redirectUrl = createReviewDetailsUrl(review.id);
              const title = getTitle(media, locale);

              return (
                <SwiperSlide key={review.id}>
                  <div
                    className="aspect-w-1 aspect-h-1 w-full overflow-y-hidden rounded-sm bg-background-800"
                    style={{
                      backgroundImage: `url(${media?.bannerImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <Link href={redirectUrl} passHref>
                      <div
                        className="
                    flex h-full w-full flex-col justify-between space-y-2 p-2 md:p-3 md:space-y-4

                    cursor-pointer  overflow-hidden bg-gradient-to-br
                  from-neutral-900/100 via-neutral-900/80 to-transparent
                    hover:border hover:border-white border border-neutral-900
                    ease-int transition duration-75 
                    "
                      >
                        <div className="space-y-4">
                          <div className="flex shrink-0 items-center space-x-2">
                            <Avatar src={user?.avatar} />

                            <div className="space-y-1 text-sm">
                              <p className="line-clamp-1">{user?.name}</p>

                              <p className="text-gray-300 line-clamp-1 text-xs">
                                {dayjs(review.created_at, { locale }).fromNow()}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="[font-size:var(--step--1)] md:[font-size:var(--step-0)] line-clamp-1 md:line-clamp-1">
                              {review.title}
                            </div>
                          </div>
                        </div>
                        <a
                          className="block shrink-0 text-xs font-semibold text-primary-300 transition duration-100 line-clamp-1 hover:text-primary-400"
                          title={title}
                        >
                          {title}
                        </a>

                        <div className="absolute right-3 bottom-8 flex flex-row space-x-2 ">
                          <TextIcon
                            LeftIcon={AiFillLike}
                            className="w-4 h-4 md:w-6 md:h-6"
                          ></TextIcon>
                          <div className="font-semibold text-sm md:text-lg">
                            {likeCount}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-2 gap-5 md:gap-7 md:grid-cols-3 lg:grid-cols-4 ">
            {data.map(({ review, media, likeCount, dislikeCount }) => {
              const user = review?.user;
              const redirectUrl = createReviewDetailsUrl(review.id);
              const title = getTitle(media, locale);

              return (
                <div
                  key={review.id}
                  className="aspect-w-2 aspect-h-1 min-h-[170px] w-full overflow-hidden rounded-xs  "
                  style={{
                    backgroundImage: `url(${media?.bannerImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  <Link href={redirectUrl} passHref={true}>
                    <div
                      className="
                    cursor-pointer h-full flex flex-col overflow-hidden
                    justify-between space-y-2 p-2 md:p-3 bg-gradient-to-br
                  from-neutral-900/100 via-neutral-900/80 to-transparent
                    hover:border hover:border-white border border-neutral-900
                    ease-int transition duration-75 
                  "
                    >
                      <div className="space-y-4">
                        <div className="[font-size:var(--step--1)] md:[font-size:var(--step-0)] line-clamp-2">
                          {review.title}
                        </div>
                      </div>

                      <div className="flex flex-col space-y-1">
                        <div className="flex flex-row space-x-2">
                          <Avatar src={user?.avatar} />

                          <div className="space-y-1 [font-size:var(--step--2)]">
                            <p className="line-clamp-1">{user?.name}</p>

                            <p className="text-gray-300 line-clamp-1 text-xs">
                              {dayjs(review.created_at, { locale }).fromNow()}
                            </p>
                          </div>
                        </div>

                        <Link href={redirectUrl} passHref={true}>
                          <a
                            className="block text-sm font-semibold text-primary-300 transition duration-200 line-clamp-1 hover:text-primary-400"
                            title={title}
                            href={redirectUrl}
                          >
                            {title}
                          </a>
                        </Link>

                        <div className="absolute right-3 bottom-8 flex flex-row space-x-2 ">
                          <TextIcon
                            LeftIcon={AiFillLike}
                            className="w-4 h-4 md:w-6 md:h-6"
                          ></TextIcon>
                          <div className="font-semibold text-sm md:text-lg">
                            {likeCount}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  ) : null;
};

export default React.memo(NewestReviews);
