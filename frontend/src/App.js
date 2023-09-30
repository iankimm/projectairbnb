import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotIndex from "./components/AllSpotPage";
import CreateSpotForm from "./components/CreateSpotForm.js";
import SpotShow from "./components/SpotShow";
import Management from "./components/Management";
import logo from './favicon-32x32.png'
import { Link } from "react-router-dom";
import './App.css'
import UpdateSpot from "./components/UpdateSpot";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  //app.js
  return (
    <div className='whole'>
    <div className='container'>
      <div className="header">
        <Link to='/'>
        <img src={logo} />
        </Link>
        <div className='title'>
          GROUNDCNC
        </div>
      </div>

      <div className='login'>
        <Navigation isLoaded={isLoaded} />
        {isLoaded && <Switch></Switch>}
      </div>
    </div>
    <hr></hr>
      <Switch>
        <Route exact path='/' component={SpotIndex} />
        <Route path='/spots/new' component={CreateSpotForm} />
        <Route path='/users/manage' component = {Management} />
        <Route path="/spots/:spotId/update" render={(props) => {
          const spotId = props.match.params.spotId;
          return (
            <UpdateSpot {...props} spotId={spotId} mode="update" />
          )
        }} />
        <Route path='/spots/:spotId' component={SpotShow} />
      </Switch>
    </div>
  );
}

export default App;
