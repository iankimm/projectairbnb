const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Spot, User, Review, ReviewImage } = require('../../db/models');

const router = express.Router();

//Get all Reviews of the Current User
router.get('/current', async (req, res) => {
  const { user } = req;

  let id = user.id;

  let Reviews = await Review.findAll({
    where: {userId : id }
  });
  return res.json({Reviews})
})

//Edit a Review
router.put('/:reviewId', async (req, res) => {
  const prevReview = await Review.findByPk(parseInt(req.params.reviewId));

  const {stars, review} = req.body;

  if(!prevReview) {
    res.status(404);
    return res.json({'message': "Review couldn't be found"})
  }

  prevReview.stars = stars;
  prevReview.review = review;

  prevReview.save();

  return res.json(prevReview);
})

//delete a review
router.delete('/:reviewId', async (req, res) => {
  const review = await Review.findByPk(req.params.reviewId);
  if(!review) {
    res.status(404);
    return res.json({"message": "Review couldn't be found"})
  }

  await review.destroy();

  return res.json({"message": "Successfully deleted"});
})

//Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', async (req, res) => {
  const currReview = await Review.findByPk(req.params.reviewId);

  const { url } = req.body;

  let reviewId = parseInt(req.params.reviewId);

  const reviewImage = await ReviewImage.create({ url, reviewId});

  const safeReviewImage = {
    id: reviewImage.id,
    url: reviewImage.url
  }

  await setTokenCookie(res, safeReviewImage);

  return res.json({
    reviewImage : safeReviewImage
  });
})

module.exports = router;
