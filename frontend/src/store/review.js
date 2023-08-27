//spot user
import { csrfFetch } from "./csrf";

const CREATE_REVIEW = 'reviews/CREATE_REVIEW'
const LOAD_REVIEW = 'reviews/LOAD_REVIEW'

/**  Action Creators: */
export const createReview = (review) => ({
  type: CREATE_REVIEW,
  review
})

export const loadReview = (reviews) => ({
  type: LOAD_REVIEW,
  reviews
})

/** Thunk Action Creators: */
export const createReviews = (payload, spotId) => async (dispatch) => {
  const {review, stars} = payload;
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    body: JSON.stringify({
      review,
      stars
    })
  });
  const data = await response.json();
  //dispatch(createReview(data));
  return response;
}

export const fetchSpotIdReviews = (payload) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${payload}/reviews`);
  const reviews = await response.json();
  dispatch(loadReview(reviews));
}



const reviewReducer = (state = {}, action) => {
  switch(action.type){
    case CREATE_REVIEW:
      return {...state, [action.review.id]: action.Review}
    case LOAD_REVIEW:
      const newState ={};
      // action.reviews.forEach((review) => {
      //   newState[review.id] = review;
      // })
      return action.reviews.Reviews
    default:
      return state;
  }
}

export default reviewReducer;
