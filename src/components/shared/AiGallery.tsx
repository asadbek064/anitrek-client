import Image from 'next/image';
import { ExperimentAnimeTitles } from "@/types/animettv";
import { useState } from 'react';
import React from 'react';

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

function BlurImage({ image }: { image: ExperimentAnimeTitles }) {
  const [isLoading, setLoading] = useState(true)

  return (
    <a href={image.cover_img} className="group">
      <div className="aspect-w-1 aspect-h-1 w-full  overflow-hidden rounded-sm bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
        <Image
          alt=""
          src={image.cover_img}
          layout="fill"
          objectFit="cover"
          className={cn(
            'duration-280 ease-in-out group-hover:opacity-75',
            isLoading
              ? 'scale-110 blur-2xl grayscale'
              : 'scale-100 blur-0 grayscale-0'
          )}
          onLoadingComplete={() => setLoading(false)}
        />
      </div>
      {/* 
       {aiTitlesLoading ? (
              <ListSwiperSkeleton />
            ) : (
             ""
            )} */}
      <h3 className="mt-2 text-md text-white-700">{image.title} | 
      {image.isDub ? (
        <h3>DUB</h3>
      ) : (
        <h3>SUB</h3>
      )}
      </h3>
    </a>
  );
}


function Gallery({ images }: { images: ExperimentAnimeTitles[] }) {
    return (
      <div className=" max-w-2xl py-10 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {images.map((image) => (
            <BlurImage key={image.title} image={image} />
          ))}
        </div>
      </div>
    )
  }

export default React.memo(Gallery);