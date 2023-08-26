import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotIndex from "./components/AllSpotPage";
import CreateSpotForm from "./components/CreateSpotForm.js";
import SpotShow from "./components/SpotShow";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  //app.js
  return (
    <>
      <div className="header">
        GroundCnC
      </div>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Switch></Switch>}
      <Switch>
        <Route exact path='/' component={SpotIndex} />
        <Route path='/spots/new' component={CreateSpotForm} />
        <Route path='/spots/:spotId' component={SpotShow} />
      </Switch>
    </>
  );
}

export default App;
