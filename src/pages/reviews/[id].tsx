import Head from "@/components/shared/Head";
import { getMediaDetails } from "@/services/anilist";
import { AnimeSourceConnection, Episode, Review, ReviewLikes } from "@/types";
import { Media, MediaType } from "@/types/anilist";
import {getTitle } from "@/utils/data";
import {
  supabaseClient as supabase,
  withPageAuth,
} from "@supabase/auth-helpers-nextjs";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import React, {  useCallback, useMemo, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import Image from "@/components/shared/Image";
import Avatar from "@/components/shared/Avatar";
import dayjs from "dayjs";
import StarterKit from "@tiptap/starter-kit";
import Text from '@tiptap/extension-text';
import ImageTipTap from '@tiptap/extension-image'
import Link from "next/link";
import Paragraph from '@tiptap/extension-paragraph'
import Document from '@tiptap/extension-document'
import TextIcon from "@/components/shared/TextIcon";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import useLikeDislike from "@/hooks/useLikeDislikeReview";

interface ViewReviewPageProps {
  media: Media;
  review: Review;
  likeCount: number;
  dislikeCount: number;
}

const ViewReviewPage: NextPage<ViewReviewPageProps> = ({ media, review, likeCount, dislikeCount }) => {
  const { locale } = useRouter();
  
  const editor = useEditor({
    editable: false,
    content: review.content,
    extensions: [StarterKit, Text, ImageTipTap, Document, Paragraph, Text],
  })
  const mediaTitle = useMemo(() => getTitle(media, locale), [media, locale]);
  const redirectUrl = `/anime/details/${media.id}`;
  const { mutate: likeReview } = useLikeDislike(); 

  // Use local state to track like and dislike counts
  const [localLikeCount, setLocalLikeCount] = useState(likeCount);
  const [localDislikeCount, setLocalDislikeCount] = useState(dislikeCount);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);

  
  const handleLike = useCallback(async () => {
    if (!hasLiked) {
      // Optimistically update the local state
      setLocalLikeCount(localLikeCount + 1);
      setHasLiked(true);

      // Decrement dislike count if previously disliked
      if (hasDisliked) {
        setLocalDislikeCount(localDislikeCount - 1);
        setHasDisliked(false);
      }

      try {
        // Call the likeReview mutation function and wait for it to complete
        likeReview({ review: review, like: true });
      } catch (error) {
        // Revert local state on error
        setLocalLikeCount(localLikeCount);
        setHasLiked(false);
      }
    }
  }, [likeReview, review, localLikeCount, hasLiked, hasDisliked, localDislikeCount]);

  const handleDislike = useCallback(async () => {
    if (!hasDisliked) {
      // Optimistically update the local state
      setLocalDislikeCount(localDislikeCount + 1);
      setHasDisliked(true);

      // Decrement like count if previously liked
      if (hasLiked) {
        setLocalLikeCount(localLikeCount - 1);
        setHasLiked(false);
      }

      try {
        // Call the likeReview mutation function and wait for it to complete
        likeReview({ review: review, like: false });
        // If successful, no need to take further action
      } catch (error) {
        // Revert local state on error
        setLocalDislikeCount(localDislikeCount);
        setHasDisliked(false);
      }
    }
  }, [likeReview, review, localDislikeCount, hasDisliked, hasLiked, localLikeCount]);



  return (
    <div className="py-20 flex flex-col items-center">
      <Head title={`${review.user.name} review of ${media.title.english}`} />
      
      <div className="relative w-full h-[300px] md:h-[500px">
          <Image
            src={media?.bannerImage}
            layout="fill"
            objectFit="cover"
            objectPosition="50% 35%"
            alt="Details banner"
          />
        <div className="banner__overlay absolute inset-0 z-10 flex flex-col justify-center items-center bg-gradient-to-t from-neutral-900/100 via-neutral-900/80 to-transparent">
          <h1 className="[font-size:var(--step-2)] font-semibold mb-8 flex justify-center">{mediaTitle}</h1>
         
          <div className="md:absolute md:right-10 md:bottom-14 lg:bottom-12 flex flex-row justify-center items-center space-x-2">
            <Avatar src={review.user?.avatar} />

              <div className="space-y-1 [font-size:var(--step--2)]">
                <p className="line-clamp-1">{review.user?.name}</p>

                <p className="text-gray-300 line-clamp-1 text-xs">
                  {dayjs(review.created_at, { locale }).fromNow()}
                </p>
              </div>
          </div>
          <Link href={redirectUrl}>
            <a
              className="block text-sm font-semibold text-primary-300 transition duration-200 line-clamp-1 hover:text-primary-400"
              title={media.title.english}
            >
              {media.title.english}
            </a>
          </Link>
        </div>
      </div>

      <div className="w-full px-8 md:px-12 py-6 rounded-sm mx-auto min-w-[320px] max-w-[850px] bg-neutral-900 ">
        <EditorContent editor={editor} className="[font-size:var(--step-0)]"/>

        <div className="float-right [font-size:var(--step-2)] font-bold flex flex-row space-x-6">
          <div className="flex flex-row space-x-4 ">
            <TextIcon 
              className="cursor-pointer ease-in transition duration-75 hover:bg-red-600 bg-red-500 w-20 h-14 flex justify-center rounded" 
              LeftIcon={AiFillDislike}
              onClick={handleDislike}
              >{localDislikeCount || 0}</TextIcon>

            <TextIcon 
              className={`cursor-pointer ease-in transition duration-75 hover:bg-green-600 bg-green-500 w-20 h-14 flex justify-center rounded`} 
              LeftIcon={AiFillLike}
              onClick={handleLike}
              >{localLikeCount || 0}</TextIcon>
          </div>
          <div className={review.rating < 10 * .25 ? "text-rose-400" : (review.rating < (10 * .95) ? "text-yellow-400" : "text-emerald-500" )}>
            {review.rating} / 10
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default ViewReviewPage;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {

    const { data:ReviewData, error:ReviewError } = await supabase
      .from<Review>("animettv_reviews ")
      .select("*,user:sce_display_users!user_id(*)")
      .eq("id", String(params.id));

    if (ReviewError) throw ReviewError;

    const [_, mediId]= ReviewData[0].topic.split('-');
    const review:Review = ReviewData[0];

    const sourcePromise = supabase
      .from<AnimeSourceConnection>("kaguya_anime_source")
      .select(
        `
          *,
          episodes:kaguya_episodes(*, source:kaguya_sources(*))
        `
      )
      .eq("mediaId", Number(mediId));

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
        type: MediaType.Anime,
        id: Number(mediId),
      },
      fields
    );


    const [{ data, error }, media] = await Promise.all([
      sourcePromise,
      mediaPromise
    ]);
    
    if (error) {
      throw error;
    }

    const { data: likesData, error: likesError } = await supabase
    .from<ReviewLikes>("AniTrek_reviews_likes")
    .select("action_type")
    .eq('review_id', review.id);
  
  if (likesError) {
    throw likesError;
  }

  const likeCount = likesData.filter((like) => like.action_type === true).length;
  const dislikeCount = likesData.filter((like) => like.action_type === false).length;

    return {
      props: {
        media,
        review,
        likeCount,
        dislikeCount
      },
    };
  } catch (error) {
    console.log("error", error);

    return { notFound: true };
  }
}