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
import React, { useMemo } from "react";

import { BsStarFill, BsThreeDotsVertical } from "react-icons/bs";
import { Popover } from "@headlessui/react";

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
console.log(progress);

  return (
    <React.Fragment>
      <div
        className={classNames(
          "relative aspect-w-2 aspect-h-3",
          className
        )}
      >
          <div
          className="h-6 rounded-tl-md rounded-tr-md text-sm h-[100%]"
          style={{ color: primaryColor }}
        >
          {/* <div className=" z-10 absolute bottom-0 bg-neutral-900 w-full px-2 py-0.5 flex flex-row ">
              <div className="flex flex-row">
                <div className="flex">
                  <BsStarFill className="mt-0.5" /> &nbsp;
                  {data.averageScore != null && data.averageScore != 0
                    ? data.averageScore / 10
                    : "."}
                </div>
              </div>
              <div className="flex flex-row mx-auto pl-0.5">
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
            </div> */}
          {watchList ? (
            ''
            ): (
              ''
            )}
        </div>
        <Link href={redirectUrl} >
          <a>
            {
              <Image
                src={data.coverImage?.extraLarge}
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

   {/*   
        {watchList ? (
          <div>
            <button className="bg-neutral-700 hover:bg-red-500 text-white font-bold rounded-md mt-1 mr-2 absolute right-0">
              <Popover className="relative rounded-md md:py-0 md:px-0.5 bg-neutral-700 hover:bg-red-500 text-white font-bold rounded-md">
                <Popover.Button>
                  <BsThreeDotsVertical className="pt-1" />
                </Popover.Button>

                <Popover.Panel className="absolute z-10">
                  <div className="flex flex-col bg-neutral-700 rounded-md p-2">
                    <button className="bg-neutral-700 hover:bg-red-500 text-white font-bold rounded-md px-2 py-1">
                      Watching
                    </button>
                    <button className="bg-neutral-700 hover:bg-red-500 text-white font-bold rounded-md px-2 py-1">
                      Planning
                    </button>
                    <button className="bg-neutral-700 hover:bg-red-500 text-white font-bold rounded-md px-2 py-1">
                      Completed
                    </button>
                    <button className="bg-neutral-700 hover:bg-red-500 text-white font-bold rounded-md px-2 py-1">
                      Dropped
                    </button>
                    </div>
                  </Popover.Panel>
                </Popover>
              </button>
            </div>
          ) : (
            ""
          )}
      */}

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
          className="mt-2 font-semibold line-clamp-2"
          style={{ color: primaryColor }}
        >
          {title}
        </p>
    
    </React.Fragment>
  );
};

export default React.memo(Card) as typeof Card;
