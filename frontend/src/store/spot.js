import { csrfFetch } from "./csrf";

const LOAD_SPOT = "spot/LOAD_SPOT";
const RECEIVE_SPOT = "spot/RECEIVE_SPOT";
const UPDATE_SPOT = "spot/UPDATE_SPOT";
const REMOVE_SPOT = "spot/REMOVE_SPOT";


const loadSpot = (spots) => ({
  type: LOAD_SPOT,
  spots,
});

const receiveSpot = (spot) => ({
  type: RECEIVE_SPOT,
  spot
})

const updateSpot = (spot) => ({
  type: UPDATE_SPOT,
  spot
})

const removeSpot = (spotId) => ({
  type: REMOVE_SPOT,
  spotId
})

//thunk actions
export const fetchSpots = (payload) => async (dispatch) => {
  const response = await fetch('/api/spots');
  const spots = await response.json();
  dispatch(loadSpot(spots));
}

export const insertSpot = (payload) => async (dispatch) => {
  const { address, city, state, country, lat, lng, name, description, price } = payload;
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    body: JSON.stringify({
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    }),
  });
  const data = await response.json();
  dispatch(fetchSpots(data));
  return response;
};

export const editSpot = (payload) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${payload}`, {
    method: "PUT",
    headers: {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify(payload)
  });
  const spot = await response.json();
  if(response.ok) {
    dispatch(updateSpot(spot));
  }
  return spot;
}

export const deleteSpots = (payload) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${payload}`, {
    method: "DELETE",
    headers: {
      "Content-Type" : "application/json"
    }
  });
  if(response.ok) {
    dispatch(removeSpot(payload));
  }
}


//reducer

const spotReducer = (state = {}, action) => {
  switch (action.type) {
    case LOAD_SPOT:
      const spotState = {};
      action.spots.forEach((spot) => {
        spotState[spot.id] = spot;
      })
      return spotState;
    case RECEIVE_SPOT:
      return {...state, spots: [...state.spots, action.spot]}
    case UPDATE_SPOT:
      return {...state, spots: [...state.spots, action.spot] }
    case REMOVE_SPOT:
      return {...state}
    default:
      return state;
  }
}

export default spotReducer;
