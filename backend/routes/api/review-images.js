const express = require('express');

const { requireAuth } = require('../../utils/auth');

const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');

const router = express.Router();

//delete a ReviewImage
router.delete('/:imageId', requireAuth, async (req, res) => {
  const reviewImage = await ReviewImage.findByPk(req.params.imageId);

  if(!reviewImage) {
    res.status(404);
    return res.json({"message": "Review Image couldn't be found"});
  }

  const review = await Review.findByPk(reviewImage.reviewId);

  if(parseInt(req.user.id) !== review.userId) {
    res.status(403);
    return res.json({"message": "Not Review Owner"});
  }

  await reviewImage.destroy();
  res.status(200);
  return res.json({"message": "Successfully deleted"});
})

module.exports = router;
