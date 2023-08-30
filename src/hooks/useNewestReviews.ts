import { getMedia } from "@/services/anilist";
import { Comment, Review } from "@/types";
import { MediaType } from "@/types/anilist";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";

const useNewestReviews = (type: MediaType) => {
  return useQuery(["newest-reviews", type], async () => {
    const { data, error } = await supabaseClient
      .from<Review>("animettv_reviews ")
      .select("*,user:sce_display_users!user_id(*)")
      .like("topic", `${type.toLowerCase()}%`)
      .order("created_at", { ascending: false });

    if (error) throw error;
    
    const mediaIds = data.map((review) => {
      const [_, mediaId] = review.topic.split("-");

      return Number(mediaId);
    });

    const mediaList = await getMedia({ id_in: mediaIds });
    
    return data.map((review) => {
      const [_, mediaId] = review.topic.split("-");

      const media = mediaList.find((media) => media.id === Number(mediaId));

      return {
        review,
        media,
      };
    });
  });
};

export default useNewestReviews;
