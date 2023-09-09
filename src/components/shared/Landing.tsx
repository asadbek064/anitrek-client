import React from "react";
import { FiStar, FiUsers, FiMonitor } from "react-icons/fi";
import Image from "next/image";
import Button from "./Button";
import Link from "next/link";

const Landing = () => {
  return (
    <div className=" text-white py-24 px-4 flex flex-col">
      <div className="container mx-auto md:text-center">
        <h1 className="text-center md:text-center [font-size:var(--step-3)] md:[font-size:var(--step-6)] font-black mb-8
        bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text
        ">
          Your Anime Streaming Guide
        </h1>
        <p className="text-center md:text-center [font-size:var(--step-1)]  mb-12">
          Track, share, and discover your favorite anime and manga with AniTrek.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-8 leading-6 md:leading-8">
          <div className="p-2 md:p-6 md:bg-neutral-800 rounded-lg md:shadow-lg flex flex-row md:flex-col justify-center space-x-2">
            <div className="w-1/4 md:w-full">
              <FiStar className="text-6xl text-primary-500 mx-auto mb-4" />
            </div>
            <div className="w-full">
              <h2 className="[font-size:var(--step-1)] font-semibold mb-4 md:tracking-wide">
                Streaming Guide for Entertainment
              </h2>
              <p className="[font-size:var(--step--1)] md:[font-size:var(--step-0)] mb-4">
                Find where to stream, TV shows and movies with AniTrek .
              </p>
            </div>
          </div>

          <div className="p-2 md:p-6 md:bg-neutral-800 rounded-lg md:shadow-lg flex flex-row md:flex-col justify-center space-x-2">
            <div className="w-1/4 md:w-full">
              <FiUsers className="text-6xl text-primary-500 mx-auto mb-4" />
            </div>
            <div className="w-full">
              <h2 className="[font-size:var(--step-1)] font-semibold mb-4 md:tracking-wide ">
                Engage in discussions
              </h2>
              <p className="[font-size:var(--step--1)] md:[font-size:var(--step-0)] mb-4">
                Share your thoughts with our thriving community, make friends,
                socialize, and receive recommendations.
              </p>
            </div>
          </div>
          <div className="p-2 md:p-6 md:bg-neutral-800 rounded-lg md:shadow-lg flex flex-row md:flex-col justify-center space-x-2">
            <div className="w-1/4 md:w-full">
              <FiMonitor className="text-6xl text-primary-500 mx-auto mb-4" />
            </div>
            <div className="w-full">
              <h2 className="[font-size:var(--step-1)] font-semibold mb-4 md:tracking-wide">
                Stay updated on your journey
              </h2>
              <p className="[font-size:var(--step--1)] md:[font-size:var(--step-0)] mb-4">
                On-the-go with one of many AniList PWA apps across iOS, Android,
                macOS, and Windows.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full my-6 flex justify-center flex-col md:flex-row space-y-4 md:space-x-4 md:space-y-0">
            <Link href={"/browse?type=anime"} passHref>
                <Button className="[font-size:var(--step-0)] tracking-wide font-semibold py-6 px-8 rounded outline outline-1 outline-sky-600" primary>Discover Anime & Manga</Button>
            </Link>

            <Link href={"/register"} passHref>
                <Button className="[font-size:var(--step-0)] tracking-wide font-semibold py-6 px-8 rounded outline outline-1" secondary>Sign up for free</Button>
            </Link>
      </div>
    </div>
  );
};

export default Landing;
