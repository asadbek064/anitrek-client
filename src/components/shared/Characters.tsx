import Avatar from "@/components/shared/Avatar";
import Section from "@/components/shared/Section";
import Swiper, { SwiperSlide } from "@/components/shared/Swiper";

import dayjs from "@/lib/dayjs";
import { Media, MediaType } from "@/types/anilist";
import { createMediaDetailsUrl, createReviewDetailsUrl } from "@/utils";
import { getTitle } from "@/utils/data";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Editor from "../features/comment/Editor";
import CommentsSwiperSkeleton from "../skeletons/CommentsSwiperSkeleton";
import { isMobile } from "react-device-detect";
import TextIcon from "./TextIcon";
import { AiFillLike, AiFillStar } from "react-icons/ai";
import DetailsSection from "./DetailsSection";
import CharacterConnectionCard from "./CharacterConnectionCard";

interface CharactersProps {
  data: Media;
}

const Characters: React.FC<CharactersProps> = (data) => {
  const anime  = data.data;
  const { t } = useTranslation("anime_details");

  return !!anime?.characters?.edges?  (
    <>
     <div>
        <Swiper
          direction={"horizontal"}
          slidesPerGroup={2}
          isOverflowHidden={true}
          hideNavigation={true}

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
      
            {anime.characters.edges.map((characterEdge, index) => {
            return (
              <SwiperSlide key={index}>
                <div 
                  className="overflow-y-hidden rounded-sm bg-background-800"
                  >
                  <CharacterConnectionCard
                    characterEdge={characterEdge}
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </>
  ) : null;
};

export default React.memo(Characters);
