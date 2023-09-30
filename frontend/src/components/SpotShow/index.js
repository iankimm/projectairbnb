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
import DeleteReviewModal from '../DeleteReview';

const SpotShow = () => {
  const { spotId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const [reviewExists, setReviewExists] = useState(false);

  const spot = useSelector(state => {
    let arr = Object.values(state.spots)
    let temp;
    for(let i = 0; i < arr.length; i++) {
      if(arr[i].id === parseInt(spotId)) temp = arr[i]
    }
    return temp;
  })

  let user = useSelector(state => state.session)
  let userId = ''
  if(user.user) userId = user.user.id;

  const reviews = useSelector(state => Object.values(state.review)).reverse();

  const owner = useSelector(state => state.currentSpotOwner)

  const images = useSelector(state => state.currentSpot.SpotImages)

  const currentSpot = useSelector(state => state.currentSpot)



  //need to add images
  useEffect(() => {
    dispatch(fetchSpotIdOwner(spotId))
    dispatch(fetchSpotIdReviews(spotId))
    dispatch(fetchImageById(spotId))

  },[dispatch, reviewExists])

  //checking cases
  let reviewTracker = false;
  let postReviewChecker = false;

  //false is right user doesnt match with owner, if true do not show
  if(reviews.length > 0 && user.user && currentSpot){
    reviews.forEach(review => {

      if(review.userId === user.user.id && currentSpot.id === review.spotId) reviewTracker = true;
    })
  }

  if(user.user && owner){
    postReviewChecker = user && owner.id === user.user.id || reviewTracker;
  }


  return (
    <div>
      <div className='header'>
        <h1>{currentSpot.name}</h1>
      </div>
      <div className='body'>
        <h3>{currentSpot.city}, {currentSpot.state}, {currentSpot.country}</h3>
      </div>
      <div className="allImages">
        <div className="imagebox">
          <div className="largeImage">
            {
            images &&
              images.map(image => {
                return (image.preview === true ? <div><img className="SpotDetailPreview" src={image.url} alt="no image available" /></div>
                : ""

                )
              })
            }
          </div>
          <div className="smallImages">
            {
            images &&
              images.map(image => {
                return(image.preview === false ? <div className="SpotDetailSmallImagesDiv"><img className="SpotDetailSmallImages" src={image.url} alt="no image available" /></div>
                : ""
                )
              })
            }
          </div>
        </div>
      </div>
      <div className="infobox">
      <div>
        <h2>Hosted by : {owner.firstName} {owner.lastName}</h2>
        <p>
          description : {currentSpot.description}
        </p>
      </div>
        <div className="sidebox">
          <div className="sideboxprice">
            ${currentSpot.price} per night
           <> <i className="fas fa-star" />{currentSpot.avgStarRating > 0 ? currentSpot.avgStarRating.toFixed(1) : 'NEW'}</>
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
      <i className="fas fa-star" /> {currentSpot.avgStarRating > 0 ? (<>{currentSpot.avgStarRating.toFixed(1)}</>) : "NEW"}
        {
          currentSpot.numReviews == 1 ?
          `· ${currentSpot.numReviews} Review`
          :
          currentSpot.numReviews > 1 ?
          `· ${currentSpot.numReviews} Reviews`
          :
          currentSpot.ownerId != userId && userId ?
          " Be the first to post a review!" : ""
        }
      </h2>
      <div>
        {
          !postReviewChecker ?
            <OpenModalButton
            buttonText="Post Your Review"
            modalComponent={<CreateReviewForm spotId={spotId}/>}
            />
            :
            ""
          }

      </div>
      <div>
        {
          reviews.map(review => {
            return(
            <div>
              <div className="reviewname">{review.User.firstName}</div>
              <Month review={review}/>
              {review.review}
              <div>
                {
                  review.userId === userId ?
                  <OpenModalButton
                  buttonText="Delete"
                  modalComponent={<DeleteReviewModal reviewId={review.id}/>}/>
                  : ""
                }
              </div>
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
