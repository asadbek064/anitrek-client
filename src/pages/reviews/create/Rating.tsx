import TextIcon from '@/components/shared/TextIcon';
import { useState } from 'react';
import { BsStarFill } from 'react-icons/bs';

interface RatingProps {
  initialValue: number;
  onRatingChange: (newRating: number) => void;
}

const Rating: React.FC<RatingProps> = ({ initialValue, onRatingChange }) => {
  const [rating, setRating] = useState(initialValue);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    onRatingChange(newRating);
  };

  return (
    <div className="flex items-center h-12">
      <span className="mr-2 text-lg font-semibold w-10 md:w-16">{rating}/10</span>
      <div className="flex space-x-1">
        {Array.from({ length: 10 }, (_, index) => index + 1).map((value) => (
          <button
            key={value}
            className={`${
              value <= rating ? 'text-yellow-400' : 'text-gray-300'
            } focus:outline-none focuse outline-none`}
            onClick={() => handleRatingChange(value)}
          >
           <TextIcon
              className="w-5 md:w-8"
              LeftIcon={BsStarFill}
           />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Rating;
