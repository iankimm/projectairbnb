const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Spot, User, Review } = require('../../db/models');

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


module.exports = router;
