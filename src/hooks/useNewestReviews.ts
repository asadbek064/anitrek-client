import { getMedia } from "@/services/anilist";
import { Comment, Review, ReviewLikes } from "@/types";
import { MediaType } from "@/types/anilist";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";

const useNewestReviews = (type: MediaType) => {
  return useQuery(["newest-reviews", type], async () => {
    const { data, error } = await supabaseClient
      .from<Review>("animettv_reviews")
      .select("*, user:sce_display_users!user_id(*)")
      .like("topic", `${type.toLowerCase()}%`)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const mediaIds = data.map((review) => {
      const [_, mediaId] = review.topic.split("-");
      return Number(mediaId);
    });

    const mediaList = await getMedia({ id_in: mediaIds });

    const reviewsWithCounts = await Promise.all(
      data.map(async (review) => {
        const [_, mediaId] = review.topic.split("-");
        const media = mediaList.find((media) => media.id === Number(mediaId));

        const { data: likesData, error: likesError } = await supabaseClient
          .from<ReviewLikes>("animettv_reviews_likes")
          .select("action_type")
          .eq('review_id', review.id);

        if (likesError) throw likesError;

        const likeCount = likesData.filter((like) => like.action_type === true).length;
        const dislikeCount = likesData.filter((like) => like.action_type === false).length;

        return {
          review,
          media,
          likeCount,
          dislikeCount,
        };
      })
    );

    return reviewsWithCounts;
  });
};

export default useNewestReviews;
