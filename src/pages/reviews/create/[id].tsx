import Description from "@/components/shared/Description";
import DotList from "@/components/shared/DotList";
import Head from "@/components/shared/Head";
import Input from "@/components/shared/Input";
import PlainCard from "@/components/shared/PlainCard";
import Section from "@/components/shared/Section";
import useCreateReview from "@/hooks/useCreateReview";
import useDevice from "@/hooks/useDevice";
import { getMediaDetails } from "@/services/anilist";
import { AnimeSourceConnection, Episode } from "@/types";
import { Media } from "@/types/anilist";
import { convert, getDescription, getTitle, sortMediaUnit } from "@/utils/data";
import {
  supabaseClient as supabase,
  withPageAuth,
} from "@supabase/auth-helpers-nextjs";
import { NextPage } from "next";
import { Trans, useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Editor as EditorType } from "@tiptap/react";
import { useUser } from "@supabase/auth-helpers-react";
import Editor from "./Editor";
import Rating from "./Rating";
import TransLink from "@/components/shared/TransLink";
import DetailsBanner from "@/components/shared/DetailsBanner";

interface CreateReviewPageProps {
  media: Media;
}


interface ReviewState {
  defaultContent?: string;
}

const CreateRoomPage: NextPage<CreateReviewPageProps> = ({ media }) => {
  const { isMobile } = useDevice();
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewState, setReviewState] = useState<ReviewState>({});
  const [rating, setRatingState] = useState<number>(5);

  const { locale } = useRouter();
  const router = useRouter();
  const { t } = useTranslation("review");
  const editorRef = useRef<EditorType>(null);
  const { asPath } = useRouter();
  const { user } = useUser();

  const { mutate: createReview, isLoading: createReviewLoading } = useCreateReview();

  const mediaTitle = useMemo(() => getTitle(media, locale), [media, locale]);
  const mediaDescription = useMemo(
    () => getDescription(media, locale),
    [media, locale]
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setReviewTitle(event.target.value);
    },
    []
  );
  
  const handleRatingChange = (rating: number) => {
    setRatingState(rating);
  }
  const handleEditorSubmit = (content: string) => {
    
    createReview({
      topic: `anime-${String(media.id)}`,
      title: reviewTitle,
      content: content,
      rating: rating,
    });

    editorRef.current?.commands?.clearContent();
    router.back();
  };

  return (
    <Section className="py-20">
      <Head title={t("create_page_title", { mediaTitle })} />

      <h1 className="[font-size:var(--step-3)] font-semibold mb-8">{t("create_review")}</h1>
      
      <DetailsBanner image={media?.bannerImage} />

      <div className="w-full flex flex-col-reverse md:flex-row gap-8 md:gap-0">
        <div className="md:w-1/3 bg-background-800 p-4 md:p-8 text-center md:text-left">
          <div className="w-[120px] md:w-[200px] mb-4 mx-auto md:mx-0">
            <PlainCard src={media.coverImage.extraLarge} />
          </div>

          <h3 className="font-semibold text-xl">{mediaTitle}</h3>

          <DotList className="mt-2">
            {media.genres.map((genre) => (
              <span key={genre}>{convert(genre, "genre", { locale })}</span>
            ))}
          </DotList>

          <Description
            description={mediaDescription || t("common:updating") + "..."}
            className="mt-4 line-clamp-6 text-gray-300"
          />
        </div>
        <div className="flex flex-col justify-between md:w-2/3 bg-background-900 p-4 md:p-8 space-y-4">

            {user ? (
              <>
              <Input 
                className="pl-2 py-2"
                placeholder="Title"
                onChange={handleInputChange}
                required
              />

            <div className="">
              <Rating initialValue={5} onRatingChange={handleRatingChange} />
            </div>
              <Editor 
                ref={editorRef}
                placeholder={t("review_placeholder")}
                defaultContent={reviewState.defaultContent}
                onSubmit={handleEditorSubmit}
                isLoading={createReviewLoading}
                textLimit={3000}
              />
              </>
            ) : (
              <p className="p-2 bg-background-800 text-gray-300">
                <Trans i18nKey="comment:need_login_msg">
                  You have to{" "}
                  <TransLink
                    href={`/login?redirectedFrom=${asPath}`}
                    className="text-primary-300 hover:underline"
                  >
                    log in
                  </TransLink>{" "}
                  to comment.
                </Trans>
              </p>
            )}
          
        </div>
      </div>
    </Section>
  );
};

export default CreateRoomPage;

export const getServerSideProps = withPageAuth({
  redirectTo: "/login",
  async getServerSideProps({ params }) {
    try {
      const sourcePromise = supabase
        .from<AnimeSourceConnection>("kaguya_anime_source")
        .select(
          `
            *,
            episodes:kaguya_episodes(*, source:kaguya_sources(*))
          `
        )
        .eq("mediaId", Number(params.id));

      const fields = `
          id
          idMal
          title {
            userPreferred
            romaji
            native
            english
          }
          description
          bannerImage
          coverImage {
            extraLarge
            large
            medium
            color
          }
          genres
        `;

      const mediaPromise = getMediaDetails(
        {
          id: Number(params.id),
        },
        fields
      );

      const [{ data, error }, media] = await Promise.all([
        sourcePromise,
        mediaPromise,
      ]);

      if (error) {
        throw error;
      }

      return {
        props: {
          media,
        },
      };
    } catch (error) {
      console.log("error", error);

      return { notFound: true };
    }
  },
});
