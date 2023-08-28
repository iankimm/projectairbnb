import './SpotShow.css'

import { Link, useParams, useHistory} from 'react-router-dom'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotIdOwner } from '../../store/currentSpotOwner';
import OpenModalButton from "../OpenModalButton";
import { fetchSpotIdReviews } from '../../store/review';
import CreateReviewForm from '../CreateReview';
import { fetchImageById } from '../../store/image';

const SpotShow = () => {
  const { spotId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const spot = useSelector(state => {
    let arr = Object.values(state.spots)
    let temp;
    for(let i = 0; i < arr.length; i++) {
      if(arr[i].id === parseInt(spotId)) temp = arr[i]
    }
    return temp;
  })

  const reviews = useSelector(state => Object.values(state.review))

  const owner = useSelector(state => state.currentSpotOwner)

  const images = useSelector(state => state.currentSpot.SpotImages)

  const currentSpot = useSelector(state => state.currentSpot)



  useEffect(() => {
    dispatch(fetchSpotIdOwner(spotId))
    dispatch(fetchSpotIdReviews(spotId))
    dispatch(fetchImageById(spotId))
  },[dispatch])

  return (
    <div>
      <div className='header'>
        <h1>{spot.name}</h1>
      </div>
      <div className='body'>
        <h3>{spot.city}, {spot.state}, {spot.country}</h3>
      </div>

      <div>
        Hosted by : {owner.firstName} {owner.lastName}
      </div>
      <p>
        description : {spot.description}
      </p>
      <div>
        {spot.price} per night
        <div>
        <OpenModalButton
          buttonText="Reserve"
          modalComponent={<div>Feature coming soon</div>}
        />
        </div>
      </div>
      <div>
        <OpenModalButton
          buttonText="Post Your Review"
          modalComponent={<CreateReviewForm spotId={spotId}/>}
        />
      </div>
      <div>
        Review List :
        {
          reviews.map(review => {
            return(<div>
                <div>Review : {review.review}</div>
                <div>Stars : {review.stars}</div>
              </div>)
          })
        }
      </div>
      <div>
        <Link to={`/`}>
          Back
        </Link>
      </div>
    </div>
  )
}

export default SpotShow;
