const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Spot, User, Review, ReviewImage, SpotImage } = require('../../db/models');
const spotimage = require('../../db/models/spotimage');

const router = express.Router();

//Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res) => {

  let reviews = await Review.findAll({
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url']
      }
    ],
    where: {userId: req.user.id}
  });

  let print = [];
  for(let i = 0; i < reviews.length; i++) {
    let temp = {};
    temp.id = reviews[i].id;
    temp.userId = reviews[i].userId;
    temp.spotId = reviews[i].spotId;
    temp.review = reviews[i].review;
    temp.stars = reviews[i].stars;
    temp.createdAt = reviews[i].createdAt;
    temp.updatedAt = reviews[i].updatedAt;
    temp.User = reviews[i].User;
    temp.ReviewImages = reviews[i].ReviewImages;

    print.push(temp);
  }

  return res.json({Reviews : print});
})

//Edit a Review
router.put('/:reviewId', requireAuth, async (req, res) => {
  const prevReview = await Review.findByPk(parseInt(req.params.reviewId));

  const {stars, review} = req.body;

  if(!prevReview) {
    res.status(404);
    return res.json({'message': "Review couldn't be found"})
  }
  if(!review || stars < 1 || stars > 5){
    res.status(400);
    return res.json({
      "message": "Bad Request",
      "errors": {
        "review": "Review text is required",
        "stars": "Stars must be an integer from 1 to 5",
      }
    })
  }

  prevReview.stars = stars;
  prevReview.review = review;

  prevReview.save();

  res.status(200);
  return res.json(prevReview);
})

//delete a review
router.delete('/:reviewId', requireAuth, async (req, res) => {
  const review = await Review.findByPk(req.params.reviewId);
  if(!review) {
    res.status(404);
    return res.json({"message": "Review couldn't be found"})
  }

  await review.destroy();
  res.status(200);
  return res.json({"message": "Successfully deleted"});
})

//Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res) => {
  const currReview = await Review.findByPk(req.params.reviewId);

  //not found
  if(!currReview) {
    res.status(404);
    return res.json({"message": "Review couldn't be found"})
  }

  //not the user
  if(currReview.userId != req.user.id) {
    res.status(403);
    return res.json({"message": "not the owner"})
  };

  //maximum count
  const imageCount = await ReviewImage.count({
    where: {
      reviewId: req.params.reviewId
    }
  })

  if(imageCount > 10) {
    res.status(403);
    return res.json({"message": "Maximum number of images for this resource was reached"})
  };

  const { url } = req.body;

  let reviewId = parseInt(req.params.reviewId);

  const reviewImage = await ReviewImage.create({ url, reviewId });

  //output
  delete reviewImage.dataValues.createdAt;
  delete reviewImage.dataValues.updatedAt;
  delete reviewImage.dataValues.reviewId;
  return res.json(reviewImage);
})

module.exports = router;
