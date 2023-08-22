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
      <div className='li-contents-flex'>
        <Link to={`/spots/${spot.id}`}> spot # {spot.id} </Link>
      </div>
    </li>
  )
}

export default SpotIndexItem;
