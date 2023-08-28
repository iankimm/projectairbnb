import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';

//reducers
import sessionReducer from "./session";
import spotReducer from './spot'
import currentSpotOwnerReducer from './currentSpotOwner';
import reviewReducer from './review';
import spotImageReducer from './image';

//rootReducer
const rootReducer = combineReducers({
  session: sessionReducer,
  spots: spotReducer,
  currentSpotOwner: currentSpotOwnerReducer,
  review: reviewReducer,
  currentSpot: spotImageReducer
});

let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
