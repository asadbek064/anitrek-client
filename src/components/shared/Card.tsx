import Image from "@/components/shared/Image";
import { Media } from "@/types/anilist";
import {
  createMediaDetailsUrl,
  getProgressCompletion,
  isColorVisible,
  parseTime,
} from "@/utils";
import { convert, getDescription, getTitle } from "@/utils/data";
import { Options } from "@popperjs/core";
import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { BsStarFill, BsThreeDotsVertical } from "react-icons/bs";

interface CardProps {
  data: Media;
  className?: string;
  containerEndSlot?: React.ReactNode;
  imageEndSlot?: React.ReactNode;
  redirectUrl?: string;
  watchList?: boolean;
}

const Card: React.FC<CardProps> = (props) => {
  const {
    data,
    className,
    imageEndSlot,
    redirectUrl = createMediaDetailsUrl(data),
    watchList,
  } = props;

  const router = useRouter();

  const primaryColor = useMemo(
    () =>
      data.coverImage?.color && isColorVisible(data.coverImage.color, "#3a3939")
        ? data.coverImage.color
        : "white",
    [data]
  );
  const title = useMemo(
    () => getTitle(data, router.locale),
    [data, router?.locale]
  );

  const progress = useMemo(
    () => getProgressCompletion(Number(data.modNotes), data.episodes),
    [data]
  );
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // handle dropdown click close and open
  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  


  return (
    <React.Fragment>
      <div
        className={classNames(
          "relative aspect-w-2 aspect-h-3",
          className
        )}
      >
          <div
          className="h-6 rounded-tl-md rounded-tr-md"
          style={{ color: primaryColor }}
        >
          
          {watchList ? (
            ''
            ): (
              <div className=" z-10 absolute bottom-0 bg-neutral-900 w-full px-2 py-0.5 flex flex-row [font-size:var(--step--1)]" style={{color: primaryColor}}>
              <div className="flex flex-row">
                <div className="flex">
                  <BsStarFill className="mt-0.5" /> &nbsp;
                  {data.averageScore != null && data.averageScore != 0
                    ? (data.averageScore / 10).toFixed(1)
                    : "."}
                </div>
              </div>
              <div className="flex flex-row mx-auto md:pl-0.5">
                {data.episodes != null && data.episodes != 0 && data.format !== "MOVIE" ? (
                    <div className="flex">
                      EP &nbsp;{data.episodes}
                    </div>    
                  ) : (
                    ""
                  )}
                <div className="absolute right-0 pr-2">
                  {data.format != null ? data.format : "."}
                </div>
              </div>
            </div>
            )}
        </div>
        <Link href={redirectUrl} >
          <a>
            {
              <Image
                src={data.coverImage?.extraLarge || 'icons/icon-512.jpg'}
                layout="fill"
                objectFit="cover"
                className="rounded-tl-md rounded-tr-md"
                alt={title}
              />
            }
            {imageEndSlot}
          </a>
            
        </Link>
       
      </div>

        {watchList ? (
          <div className="bg-neutral-900 h-2 dark:bg-gray-900">
            <div
            style={{ width: `${progress}%` }}
              className={`${
                progress !== 0 ? `bg-red-600 h-2 ` : ""
              }`}
            >
              {/* if progress 100% round the corners && show progress if at least one ep watched */}
              <div className="pl-1 pt-0.5 text-xs -mt-5 absolute bg-gradient-to-r from-neutral-900 to-neutral-700 pr-1 rounded-tr-md opacity-90">
                EP {data.modNotes != null ? data.modNotes : ""}{" / "}{ data.episodes}
                &nbsp;&nbsp;
                {data.duration != null ? parseTime(data.duration / 2) : ""}
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        <p
          className="mt-2 font-semibold [font-size:var(--step--1)] md:[font-size:var(--step-1)] line-clamp-2"
          style={{ color: primaryColor }}
        >
          {title}
        </p>
    
    </React.Fragment>
  );
};

export default React.memo(Card) as typeof Card;
