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
    <li>
      <Link to={`/spots/${spot.id}`}>
        <div className="tooltip">
          {spot.name}
        </div>
        <div className='li-contents-flex'>
        <div>
          {spot.city}, {spot.state}
        </div>
        <div>
          ${spot.price} night
        </div>
      </div>
      </Link>
    </li>
  )
}

export default SpotIndexItem;
