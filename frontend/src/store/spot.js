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

const updateSpot = (update) => ({
  type: UPDATE_SPOT,
  update
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
  const { previewImage, oneImage, twoImage, threeImage, fourImage} = payload;
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

  if(data.id && previewImage) {
    const previewImageLoad = await csrfFetch(`/api/spots/${data.id}/images`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: previewImage,
        preview: true
      })
    })
  }

  if(data.id && oneImage) {
    const previewImageLoad = await csrfFetch(`/api/spots/${data.id}/images`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: oneImage,
        preview: false
      })
    })
  }

  if(data.id && twoImage) {
    const previewImageLoad = await csrfFetch(`/api/spots/${data.id}/images`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: twoImage,
        preview: false
      })
    })
  }

  if(data.id && threeImage) {
    const previewImageLoad = await csrfFetch(`/api/spots/${data.id}/images`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: threeImage,
        preview: false
      })
    })
  }

  if(data.id && fourImage) {
    const previewImageLoad = await csrfFetch(`/api/spots/${data.id}/images`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: fourImage,
        preview: false
      })
    })
  }

  dispatch(fetchSpots(data));
  return data;
};



export const editSpot = (spotId, payload) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    headers: {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify(payload)
  });
  const spot = await response.json();
  if(response.ok) {
    dispatch(updateSpot(response));
  }
  return spot;
}

export const deleteImages = (payload) => async (dispatch) => {
  const response = await csrfFetch(`/api/spot-images/${payload}`, {
    method: "DELETE"
  });
  if(response.ok) {
    dispatch(removeSpot(payload));
  }
}

export const deleteSpots = (payload) => async (dispatch) => {
  // const removeImage = await csrfFetch(`/api/spots/${payload}/images`, {
  //   method: "DELETE",
  //   headers: {
  //     "Content-Type" : "application/json"
  //   }
  // });

  const response = await csrfFetch(`/api/spots/${payload}`, {
    method: "DELETE"
  })
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
      // return {...state, spots: state.spots.map((spot) =>
      //   // spot.id === action.update.id ? action.update : spot
      //   spot
      // )}
      return {...state,
      // spots: state.spots.map((spot) =>
      // // spot.id === action.update.id ? action.update : spot
      // console.log('spot', spot)
      // )
      }
    case REMOVE_SPOT:
      return {
        ...state
      }
    default:
      return state;
  }
}

export default spotReducer;
