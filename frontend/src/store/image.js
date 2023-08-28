import { csrfFetch } from "./csrf";

export const LOAD_SPOT_IMAGE = 'spots/LOAD_SPOTIMAGE'

export const loadSpotImage = (spot) => ({
  type: LOAD_SPOT_IMAGE,
  spot
})

export const fetchImageById = (payload) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${payload}`);
  const spot = await response.json();
  dispatch(loadSpotImage(spot));
  return spot;
}

const spotImageReducer = (state = {}, action) => {
  switch(action.type){
    case LOAD_SPOT_IMAGE:
      const newState = action.spot;
      return newState;
    default:
      return state;
  }
}

export default spotImageReducer;
