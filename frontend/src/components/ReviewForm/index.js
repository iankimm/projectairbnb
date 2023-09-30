import './ReviewForm.css'

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createReviews, fetchSpotIdReviews } from '../../store/review';
import { useModal } from '../../context/Modal';

const ReviewForm = ({ spotId}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const {closeModal} = useModal();

  //review information
  const [review, setReview] = useState('');
  const [stars, setStars] = useState('');

  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    //needs to be added to state
    let reviews = {review, stars};
    dispatch(createReviews(reviews, spotId))
    .then(closeModal)
    .catch(async (res) => {
      const data = await res.json();
      if (data && data.errors) {
        setErrors(data.errors);
      }
    })
    .then(dispatch(fetchSpotIdReviews(spotId)));
    window.location.reload();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="ReviewFormTitle">How was your stay?</div>
      <div>{errors.stars && <p>{errors.stars}</p>}</div>
      <div>{errors.reviews && <p>{errors.reviews}</p>}</div>
      <label>
        Reviews :
        <input
          type="text"
          value={review}
          placeholder='Leave your review here'
          onChange={(e)=> setReview(e.target.value)}
        />
      </label>
      <label>
        Stars :
        <input
          type="text"
          value={stars}
          placeholder="1 - 5"
          onChange={(e) => setStars(e.target.value)}
        />
      </label>
      {/* <label>
        Stars :
        <select onChange={e => setStars(e.target.value)}>
          <option value='1'>1</option>
          <option value='2'>2</option>
          <option value='3'>3</option>
          <option value='4'>4</option>
          <option value='5'>5</option>
        </select>
      </label> */}
      <button type="submit"
      disabled={
        review.length < 10 ||
        stars.length < 1 ||
        (parseInt(stars) < 1 || parseInt(stars) > 5)
      }>Submit Your Review</button>
    </form>
  )
}

export default ReviewForm;
