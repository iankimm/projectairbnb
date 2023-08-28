import './SpotIndex.css'

import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const SpotIndexItem = ({spot}) => {
  const dispatch = useDispatch();

  const handleDelete = (e) => {
    e.preventDefault();
    //must add delete dispatch
  }

  return (
    <Link className="spotContainers" to={`/spots/${spot.id}`}>
        <div className="tooltip">
          {spot.name}
        </div>
        <div className='li-contents-flex'>
          {
            spot.previewImage ?
              <img src={spot.previewImage} alt={spot.name} />
              :
              <div>No Image available</div>
          }
        <div>
          {spot.city}, {spot.state}
          <i className="fas fa-star" />{spot.avgRating > 0 ? spot.avgRating : 'New'}
        </div>
        <div>
          ${spot.price} night
        </div>
        </div>

    </Link>
  )
}

export default SpotIndexItem;
