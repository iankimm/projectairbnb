import { useDispatch, useSelector } from 'react-redux';
import './Management.css'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SpotIndexItem from '../SpotIndexItem';
import UpdateSpot from '../UpdateSpot';
import DeleteSpotModal from '../DeleteSpot';
import OpenModalButton from '../OpenModalButton';
import { fetchSpots } from '../../store/spot';
import { Route, useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const Management = () => {
  const history = useHistory();

  const dispatch = useDispatch();

  const currentUser = useSelector(state => state.session.user)

  const spots = useSelector(state => Object.values(state.spots))

  const [spotExists, setSpotExists] = useState(true);

  let mySpots = [];
  if(currentUser && spots){
    spots.forEach(spot => {
      if(spot.ownerId === currentUser.id) mySpots.push(spot)
    })
  }

  const handleUpdate = (spotId) => {
    history.push(`/spots/${spotId}/update`, {method : "PUT"});
  }

  useEffect(() => {
    dispatch(fetchSpots(spots))
    //if(mySpots.length < 1) setSpotExists(false);
  }, [dispatch])



  return (
    <div>
      <header>Manage Spots</header>
      {
        spotExists
        ?
        <div>
            {
              mySpots.map((spot) => {
                return (
                  <div>
                    {/* bugs
                    delete deleting pictures but not spot at first return
                    updating fully */}
                    <SpotIndexItem spot={spot} key={spot.id}/>
                    <button className="update-button" onClick={(e) => {
                      e.stopPropagation();
                      handleUpdate(spot.id);
                    }}> Update </button>
                    {/* <button onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(spot.id)
                    }}>Delete</button> */}
                     <OpenModalButton
                     buttonText="Delete"
                     modalComponent={<DeleteSpotModal spotId={spot.id}/>}/>
                  </div>
                )
              })
            }
        </div>
        :
        <div>
          <Link to='/spots/new'>Create a New Spot</Link>
        </div>
      }
    </div>
  )
}

export default Management;
