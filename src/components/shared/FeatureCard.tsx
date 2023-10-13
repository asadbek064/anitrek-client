import React from "react";
import Image from 'next/image'
import { isMobile } from "react-device-detect";

export interface FeatureCardData {
    title: string;
    heading: string;
    description: string;
    img: string;
}

interface FeatureCardProps {
    cardData: FeatureCardData;
}

const FeatureCard: React.FC<FeatureCardProps> =  ({cardData}) => {
    return (
        <div className="max-w-sm rounded-sm overflow-hidden flex flex-col bg-gradient-to-b from-neutral-900 to bg-neutral-950 w-full aspect-square p-4 my-2">
            <div className="flex justify-center">
                <Image
                    src={cardData.img}
                    width={isMobile ? 225 : 300}
                    height={isMobile ? 196 : 280}
                    alt="feature backdrop"
                />
            </div>
            <div className="flex flex-col justify-between mt-4 py-0 lg:mt-8 px-2 md:px-6 lg:py-4 text-center h-full">
                <div className="text-primary-600 mb-2 text-[var(--step--1)] lg:text-[var(--step--2)] font-semibold">{cardData.title}</div>
                <div className="text-white text-base text-[var(--step-2)] lg:text-[var(--step-1)] font-bold leading-8 py-4">{cardData.heading}</div>
                <div className="text-white text-base text-[var(--step--1)] lg:text-[var(--step--0)]">{cardData.description}</div>            
            </div>
        </div>
    );
}

export default FeatureCard;
