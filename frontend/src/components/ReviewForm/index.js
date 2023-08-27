import './ReviewForm.css'

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createReviews } from '../../store/review';

const ReviewForm = ({ spotId}) => {
  const history = useHistory();
  const dispatch = useDispatch();

  //review information
  const [review, setReview] = useState('');
  const [stars, setStars] = useState('');

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    //needs to be added to state
    let reviews = {review, stars};
    console.log("REVIEW", review)
    dispatch(createReviews(reviews, spotId));
  }

  return (
    <form onSubmit={handleSubmit}>
      <title>How was your stay?</title>
      <label>
        Reviews :
        <input
          type="text"
          value={review}
          placehoder='Leave your review here'
          onChange={(e)=> setReview(e.target.value)}
        />
      </label>
      <label>
        Stars :
        <select onChange={e => setStars(e.target.value)}>
          <option value='1'>1</option>
          <option value='2'>2</option>
          <option value='3'>3</option>
          <option value='4'>4</option>
          <option value='5'>5</option>
        </select>
      </label>
      <button type="submit">Submit Your Review</button>
    </form>
  )
}

export default ReviewForm;
