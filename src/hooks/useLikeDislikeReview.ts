import { Review, ReviewLikes } from "@/types";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

interface UseLikeDislikePayload {
  review: Review;
  like: boolean; // true for like, false for dislike
}

const useLikeDislike = () => {
  const { user } = useUser();

  return useMutation<ReviewLikes, PostgrestError, UseLikeDislikePayload, any>(
    //@ts-ignore
    async ({ review, like }: UseLikeDislikePayload) => {

      if (!user) throw new Error("Please login to comment");

      const { data, error } = await supabaseClient
        .from<ReviewLikes>("AniTrek_reviews_likes")
        .upsert([
          {
            user_id: review.user_id,
            review_id: review.id,
            action_type: like
          }
        ]);

      if (error) throw error;

      return data?.[0] || {}; // Return the first element of the array or an empty object
    },
    {
      onSuccess: (_, params) => {
        toast(`You've ${params.like ? "liked the review. 👍" : "disliked the review. 👎"}`, {
          position: "top-right",
          autoClose: 900,
          toastId: '69'
        });
      },
      onError: (error ) => {
        toast.error(error.message, { position: "top-right" });
      },
    }
  );
};

export default useLikeDislike;
