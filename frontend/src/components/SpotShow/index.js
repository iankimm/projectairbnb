import './SpotShow.css'

import { Link, useParams, useHistory} from 'react-router-dom'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpotIdOwner } from '../../store/currentSpotOwner';
import OpenModalButton from "../OpenModalButton";
import { fetchSpotIdReviews } from '../../store/review';
import CreateReviewForm from '../CreateReview';
import { fetchImageById } from '../../store/image';
import Month from './month';

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

  let previewImage = '';
  let tempImages = [];
  let smallImages = [];

  //need to add images


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
      <div className="imagebox">
        <div className="preview">
          <img src={previewImage} alt="no image available" />
        </div>
        <div className="smallImages">
          {
            smallImages.map(image => {
              return <div><img src={image} alt="no image available"/></div>
            })
          }
        </div>
      </div>
      <div>
        <h2>Hosted by : {owner.firstName} {owner.lastName}</h2>
      </div>
      <div className="infobox">
        <p>
          description : {spot.description}
        </p>
        <div className="sidebox">
          {spot.price} per night
          <div>
            <i className="fas fa-star" />{currentSpot.avgStarRating > 0 ? currentSpot.avgStarRating : 0}
          </div>
          <div>
            {currentSpot.numReviews} Reviews
          </div>
          <div>
          <OpenModalButton
            buttonText="Reserve"
            modalComponent={<div>Feature coming soon</div>}
          />
          </div>
        </div>
      </div>
      <hr></hr>
      <h2>
        <i className="fas fa-star" />{currentSpot.avgStarRating > 0 ? currentSpot.avgStarRating : 0}
        {
          currentSpot.numReviews > 0 ?
          `· ${currentSpot.numReviews} Reviews`
          :
          ""
        }
      </h2>
      <div>
        {
          reviews.map(review => {
            return(
            <div>
              <div className="reviewname">{review.User.firstName}</div>
              <Month review={review}/>
              {review.review}
            </div>)
          })
        }
      </div>
      <div>
        <OpenModalButton
          buttonText="Post Your Review"
          modalComponent={<CreateReviewForm spotId={spotId}/>}
        />
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
