import { Review } from "@/types";

interface ReviewCardProps {
    review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
    return (
        <>
            <div className="border p-4 mb-4">
                <h3>Rating: {review.rating}</h3>
                <p>{review.content}</p>
                
                <div className="flex justify-between mt-4">
                    <div className="flex items-center space-x-2">
                        <button className="px-3 py-1 border rounded-xs hover:bg-green-600">
                            Likes: {review.likes}
                        </button>
                        <button className="px-3 py-1 border rounded-xs hover:bg-red-600">
                            Likes: {review.dislikes}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ReviewCard