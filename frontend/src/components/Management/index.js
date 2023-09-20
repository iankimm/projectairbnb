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

  const [spotExists, setSpotExists] = useState(true);

  let mySpots = [];
  if(currentUser && spots){
    spots.forEach(spot => {
      if(spot.ownerId === currentUser.id) mySpots.push(spot)
    })
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
                    <SpotIndexItem spot={spot} key={spot.id}/>
                    <Link to="/componentB">
                      <button>Update</button>
                    </Link>
                    <UpdateSpot spot={spot} />
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
