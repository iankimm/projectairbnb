import './SpotIndex.css'

import { Link } from 'react-router-dom';

const SpotIndexItem = ({spot}) => {
  const averageRating = spot.avgRating;
  return (
    <Link className="spotContainers" to={`/spots/${spot.id}`}>
        <div className="tooltip">
          {spot.name}
        </div>
        <div className='li-contents-flex'>
          {
            spot.previewImage ?
              <img src={""} alt={spot.name} />
              :
              <div>No Image available</div>
          }
        <div>
          {spot.city}, {spot.state}
          <i className="fas fa-star" /> {averageRating > 0 ? averageRating : 'New'}
        </div>
        <div>
          ${spot.price} night
        </div>
        </div>

    </Link>
  )
}

export default SpotIndexItem;
