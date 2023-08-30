import Avatar from "@/components/shared/Avatar";
import Section from "@/components/shared/Section";
import Swiper, { SwiperSlide } from "@/components/shared/Swiper";

import dayjs from "@/lib/dayjs";
import { MediaType } from "@/types/anilist";
import { createMediaDetailsUrl } from "@/utils";
import { getTitle } from "@/utils/data";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Editor from "../features/comment/Editor";
import CommentsSwiperSkeleton from "../skeletons/CommentsSwiperSkeleton";
import useNewestReviews from "@/hooks/useNewestReviews";
import DetailsBanner from "./DetailsBanner";
import { isMobile } from "react-device-detect";

interface NewestReviewsProps {
  type: MediaType;
}

const NewestReviews: React.FC<NewestReviewsProps> = (props) => {
  const { data, isLoading } = useNewestReviews(props.type);
  const { t } = useTranslation("common");
  const { locale } = useRouter();
  

  if (isLoading) {
    return <CommentsSwiperSkeleton />;
  }

  return data?.length ? (
    <>
      {isMobile ? (
        <div>
        <Swiper
          direction={"vertical"}
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
          {data.map(({ review, media }) => {
            const user = review?.user;
            const redirectUrl = createMediaDetailsUrl(media);
            const title = getTitle(media, locale);
  
            return (
              <SwiperSlide key={review.id}>
                <div className="aspect-w-1 aspect-h-1 w-full overflow-y-hidden rounded-sm bg-background-800">
                  <div className="flex h-full w-full flex-col justify-between space-y-2 p-2 md:p-3 md:space-y-4">
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
  
                      <Editor
                        className="line-clamp-2 md:line-clamp-4"
                        readOnly
                        defaultContent={review.content}
                      />
                    </div>
                    {/* <DetailsBanner image={media?.bannerImage} /> */}
                    <Link href={redirectUrl}>
                      <a
                        className="block shrink-0 text-sm font-semibold text-primary-300 transition duration-200 line-clamp-1 hover:text-primary-400"
                        title={title}
                      >
                        {title}
                      </a>
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {data.map(({ review, media }) => {
              const user = review?.user;
              const redirectUrl = createMediaDetailsUrl(media);
              const title = getTitle(media, locale);

              return (
                <div
                  key={review.id}
                  className="aspect-w-2 aspect-h-1 min-h-[150px] w-full overflow-hidden rounded-sm "
                  style={
                    {backgroundImage: `url(${media?.bannerImage})`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     backgroundRepeat: 'no-repeat',
                    }}
                >
                  <div className="h-full flex flex-col overflow-hidden justify-between space-y-2 p-2 md:p-3 bg-gradient-to-tr from-neutral-900/100 via-neutral-900/80 to-transparent">
                    <div className="space-y-4">
                      <div className="[font-size:var(--step-2)] md:[font-size:var(--step-0)]">
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
                      <Link href={redirectUrl}>
                        <a
                          className="block text-sm font-semibold text-primary-300 transition duration-200 line-clamp-1 hover:text-primary-400"
                          title={title}
                        >
                          {title}
                        </a>
                      </Link>
                    </div>
                  </div>
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
