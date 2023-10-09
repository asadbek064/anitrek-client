import React from "react";
import Image from 'next/image'

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
        <>
        <div className="
            max-w-sm rounded-sm overflow-hidden flex flex-col justify-center
            bg-gradient-to-b from-neutral-900 to bg-neutral-950
            w-full
            ">
            <div className="h-1/2 flex justify-center">
            <Image
                src={cardData.img}
                width={300}
                height={280}
                alt="feature backdrop"
            />                
            </div>
            <div className="mt-8 px-6 py-4 text-center">
                <div className="[font-size:var(--step--2)] font-semibold text-primary-600 mb-2">{cardData.title}</div>
                <div className="[font-size:var(--step-1)] font-bold leading-8 py-4 text-white text-base">{cardData.heading}</div>
                <div className="[font-size:var(--step--0)] text-white text-base">{cardData.description}</div>            </div>
        </div>
        </>
    );   
}

export default FeatureCard;