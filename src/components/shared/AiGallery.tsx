import Image from 'next/image';
import { ExperimentAnimeTitles } from "@/types/animettv";
import { useState } from 'react';
import React from 'react';
import { useRouter } from 'next/router';

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
/* const createMediaDetailsUrl = (aiTitle: ExperimentAnimeTitles) => {
      return `http://animet.tv/experiment/anime-60fps/${aiTitle.title}`;
}
 */
function BlurImage({ image }: { image: ExperimentAnimeTitles }) {
  const router = useRouter();
  const [isLoading, setLoading] = useState(true)

  return (
    <div>
      <div onClick={() => router.push(`/anime/ai-watch/${image.title}`)} className="cursor-pointer">
        <div className="aspect-w-6 aspect-h-3 w-full overflow-hidden rounded-sm bg-neutral-600 ">
          <Image
            alt=""
            src={image.cover_img}
            layout="fill"
            objectFit="cover"
            className={cn(
              'duration-100 ease-in-out group-hover:opacity-75',
              isLoading
              ? 'scale-110 blur-2xl grayscale'
              : 'scale-100 blur-0 grayscale-0'
              )}
              onLoadingComplete={() => setLoading(false)}
          />
        </div>
        <div className="mt-2 text-white-900">{image.title} | 
        {image.isDub ? (
          ' DUB'
          ) : (
            ' SUB'
            )}
            
        </div>

      </div>

    </div>
  );
}


function Gallery({ images }: { images: ExperimentAnimeTitles[] }) {
    return (
      <div className="py-0 md:py-2 px-6 lg:max-w-7xl">
        <div className="grid grid-cols-1 gap-y-4 gap-x-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-6 min-w-full">
          {images.map((image) => (
            <BlurImage key={image.title} image={image} />
          ))}
        </div>
      </div>
    )
  }

export default React.memo(Gallery);