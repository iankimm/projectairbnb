import { useDispatch, useSelector } from 'react-redux';
import './Management.css'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SpotIndexItem from '../SpotIndexItem';
import UpdateSpot from '../UpdateSpot';
import DeleteSpotModal from '../DeleteSpot';
import OpenModalButton from '../OpenModalButton';
import { fetchSpots } from '../../store/spot';

const Management = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.session.user)
  const spots = useSelector(state => Object.values(state.spots))

  const [spotExists, setSpotExists] = useState(false);

  let mySpots = [];
  if(currentUser && spots){
    spots.forEach(spot => {
      if(spot.ownerId === currentUser.id) mySpots.push(spot)
    })
  }

  useEffect(() => {
    dispatch(fetchSpots(spots))
    if(mySpots.length > 0) setSpotExists(true);
  }, [spotExists])

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
                    <SpotIndexItem spot={spot} key={spot.id}/>
                    <UpdateSpot spot={spot}/>
                    update spot button
                    delete button
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
