import { useSelector } from 'react-redux';
import './Management.css'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SpotIndexItem from '../SpotIndexItem';
import UpdateSpot from '../UpdateSpot';

const Management = () => {
  const currentUser = useSelector(state => state.session.user)
  const spots = useSelector(state => Object.values(state.spots))

  const [spotExists, setSpotExists] = useState(false);

  console.log('currentUser', currentUser);
  console.log('spots', spots);
  console.log('spotownerId', spots[0].ownerId)

  let mySpots = [];

  spots.forEach(spot => {
    if(spot.ownerId === currentUser.id) mySpots.push(spot)
  })

  console.log('mySpots', mySpots)

  useEffect(() => {
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
                    button
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
