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
import { Popover } from '@headlessui/react'

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

  return (

            <React.Fragment>
              <div
                className={classNames(
                  "relative aspect-w-2 aspect-h-3",
                  className
                )}
              >
                {/* title stat bar */}
                <div
                  className="flex flex-row px-1 absolute bg-neutral-900 h-6 z-10 opacity-90 rounded-tl-md rounded-tr-md"
                  style={{ color: primaryColor }}
                >
                  <div className="flex flex-row">
                    <div className="flex">
                    <BsStarFill className="mt-0.5"/> &nbsp;
                      {data.averageScore != null && data.averageScore != 0
                        ? data.averageScore / 10
                        : "."}
                    </div>
                  </div>
                  <div className="flex flex-row mx-auto pl-0.5">
                    <div className="">
                      EP{" "}
                      {data.episodes != null && data.episodes != 0
                        ? data.episodes
                        : "."}
                    </div>
                    <div className="pl-1 ">
                      {data.format != null ? data.format : "."}
                    </div>
                  </div>

                  {/* drop title button */}
                  {watchList ? (
                    <div className="absolute right-0 z-10">
                    <button className="bg-neutral-700 hover:bg-red-500 text-white font-bold rounded-tr-md">
                      <Popover className="relative rounded-md  md:py-0 md:px-0.5">
                        <Popover.Button>
                          <BsThreeDotsVertical />
                        </Popover.Button>

                        <Popover.Panel className="absolute z-10 ">
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
                    ''
                  )}
                </div>
                
                <Link href={redirectUrl}>
                  <a>
                    {<Image
                      src={data.coverImage?.extraLarge}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-tl-md rounded-tr-md"
                      alt={title}
                    />}
                    {imageEndSlot}
                  </a>
                </Link>
              </div>

              <div className="text-sm md:text-base">
                {watchList ? (
                  <div className="w-full bg-neutral-900 h-5 md:h-6 dark:bg-gray-900 rounded-bl-md rounded-br-md">
                    <div
                      className={`${(Number(data.modNotes) / data.episodes) * 100 !== 0 && !isNaN((Number(data.modNotes) / data.episodes) * 100) ? `bg-red-600 h-5 md:h-6 w-[${getProgressCompletion(Number(data.modNotes),data.episodes)}%]` : `h-5 md:h-6 rounded-bl-md rounded-br-md`}`}
                    >
                      {" "}
                      {/* if progress 100% round the corners && show progress if at least one ep watched */}
                      <div className="absolute pl-1 pt-0.5">
                        EP {data.modNotes != null ? data.modNotes : ""}{" "}
                        &nbsp;&nbsp;&nbsp;
                        {data.duration != null
                          ? parseTime(data.duration / 2)
                          : ""}
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <p
                  className="mt-1 font-semibold line-clamp-2"
                  style={{ color: primaryColor }}
                >
                  {title}
                </p>
                
              </div>
            </React.Fragment>
      
  );
};

export default React.memo(Card) as typeof Card;
