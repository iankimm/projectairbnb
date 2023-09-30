import './SpotIndex.css'

import { Link } from 'react-router-dom';

const SpotIndexItem = ({spot}) => {
  let averageRating = spot.avgRating;

  if(averageRating == 1) averageRating = 1.0;
  else if(averageRating == 2) averageRating = 2.0;
  else if(averageRating == 3) averageRating = 3.0;
  else if(averageRating == 4) averageRating = 4.0;
  else if(averageRating == 5) averageRating = 5.0;

  return (
    <Link className="spotContainers" to={`/spots/${spot.id}`}>
        <div className="tooltip">
          {spot.name}
        </div>
        <div className='li-contents-flex'>
          {
            spot.previewImage ?
              <img className="SpotIndexLargeImage"src={spot.previewImage} alt={spot.name} />
              :
              <div>No Image available</div>
          }
        <div>
          {spot.city}, {spot.state} {averageRating > 0 ? (<><i className="fas fa-star" /> {averageRating}</>) : <><i className="fas fa-star" /> NEW</>}
        </div>
        <div>
          ${spot.price} night
        </div>
        </div>

    </Link>
  )
}

export default SpotIndexItem;
