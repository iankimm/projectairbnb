import './CreateReview.css'
import ReviewForm from '../ReviewForm';

const CreateReviewForm = ({spotId}) => {
  const review = {
    stars: '',
    reviews: ''
  };

  return (
    <ReviewForm review={review} spotId={spotId}/>
  )
};

export default CreateReviewForm;
