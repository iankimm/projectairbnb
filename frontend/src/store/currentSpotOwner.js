//spot user
import { csrfFetch } from "./csrf";

export const LOAD_CURRENT_SPOT = 'spots/LOAD_CURRENT_SPOT'

export const loadCurrentSpot = (spot) => ({
  type:LOAD_CURRENT_SPOT,
  spot
})

export const fetchSpotIdOwner = (payload) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${payload}`);
  const spot = await response.json();
  dispatch(loadCurrentSpot(spot));
}

const currentSpotOwnerReducer = (state = {}, action) => {
  switch(action.type){
    case LOAD_CURRENT_SPOT:
      const newState = action.spot.Owner
      return newState;
    default:
      return state;
  }
}

export default currentSpotOwnerReducer;
