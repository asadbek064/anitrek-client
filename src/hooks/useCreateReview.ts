import { Review } from "@/types";
import { randomString } from "@/utils";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useUser } from "@supabase/auth-helpers-react";
import { PostgrestError } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "react-toastify";

interface UseAddReviewPayload {
  topic: string;
  title: string;
  content: string;
  rating: number;
}

const useCreateReview = () => {
  const queryClient = useQueryClient();
  const { user } = useUser();

  return useMutation<Review, PostgrestError, UseAddReviewPayload, any>(
    async ({
      topic,
      title,
      content,
      rating,
    }: UseAddReviewPayload) => {
      if (!user) throw new Error("Please login to review a title!");

      const { count, error: countError } = await supabaseClient
      .from("animettv_reviews")
      .select('*', { count: 'exact', head: true })
      .eq("user_id", user?.id);
      
      if (countError) { throw countError}

      if (count <= 25) { // allow 50 reviews per user
          const { data, error } = await supabaseClient
          .from<Review>("animettv_reviews")
          .upsert({
              topic: topic,
              title: title,
              content: content,
              user_id: user?.id,
              rating: rating,
              likes: 0, // Initial likes count
              dislikes: 0, // Initial dislikes count
          })
          .single();

        if (error) throw error;
        
        
        return data;
      } else {
        throw new Error('You have reached maximum # posts.');
      }
    },
    {
      onSuccess: (_, params) => {
        queryClient.invalidateQueries([
          "review",
          { topic: params.topic },
        ]);

        toast.success(`
        Your review has been posted. 🙌
        `,
        {position: "top-right", autoClose: 4000})
      },
      onError: (error) => {
        if (error.code === "23505") {
          toast.warning('You already have a review for this title', { position: "top-right", autoClose: 4000})
        } else {
          toast.error(error.message, { position: "top-right"});
        }
      },
    }
  );
};

export default useCreateReview;
