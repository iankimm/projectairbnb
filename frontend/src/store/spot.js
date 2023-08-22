import { csrfFetch } from "./csrf";

const GET_SPOT = "spot/GetSpot";

const getSpot = (spots) => {
  return {
    type: GET_SPOT,
    payload: spots,
  };
};

//thunk actions
export const fetchSpots = (payload) => async (dispatch) => {
  const response = await fetch('/api/spots');
  const spots = await response.json();
  dispatch(getSpot(spots));
}

//reducer

const spotReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_SPOT:
      const spotState = {};
      action.spots.forEach((spot) => {
        spotState[spot.id] = spot;
      })
      return spotState;
    default:
      return state;
  }
}
