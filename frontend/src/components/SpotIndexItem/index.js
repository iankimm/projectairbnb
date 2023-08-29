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
              <img className="SpotIndexLargeImage"src={spot.previewImage} alt={spot.name} />
              :
              <div>No Image available</div>
          }
        <div>
          {spot.city}, {spot.state} {averageRating > 0 ? (<><i className="fas fa-star" /> {averageRating}</>) : 'NEW'}
        </div>
        <div>
          ${spot.price} night
        </div>
        </div>

    </Link>
  )
}

export default SpotIndexItem;
