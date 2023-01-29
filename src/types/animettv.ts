export type Maybe<T> = T | null ;

export interface ExperimentAnimeTitles {
    title: string;
    cover_img: string;
    isDub: boolean,
    isSub: boolean,
    quality: string;
    isNew?: boolean;
    isRemastered?:boolean;
    isDownload: boolean;
    isNSFW: boolean;
    score?: number;
    type?: string;
  }


export interface AiTitles {
    Ai4k: Maybe<ExperimentAnimeTitles[]>;
    Ai60fps: Maybe<ExperimentAnimeTitles[]>;
    AiRemastered: Maybe<ExperimentAnimeTitles[]>;
    AiHentai: Maybe<ExperimentAnimeTitles[]>;
}

export interface anime60fps {
  src: string;
  iframe: boolean;
  download?: string;
  episode_number: number;
}
export interface AiSource {
  anime60fps: Maybe<anime60fps[]>;
}
