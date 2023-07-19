const express = require('express');

const { requireAuth } = require('../../utils/auth');

const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');

const router = express.Router();

//Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res) => {
  const reviews = await Review.findAll({
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      },
      {
        model: Spot,
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'description']
        },
        include: {
          model: SpotImage,
          attributes: ['url'],
          limit: 1
        },
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url']
      }
    ],
    where: {userId: req.user.id}
  });

  const print = reviews.map((review) => {
    const temp = review.toJSON();


    if(temp.Spot.SpotImages.length > 0) {
      temp.Spot.reviewImage = temp.Spot.SpotImages[0].url
    }
    else {
      temp.Spot.reviewImage = ''
    }

    delete temp.Spot.SpotImages;

    return temp;
  })

  return res.json({Reviews: print})
})

//Edit a Review
router.put('/:reviewId', requireAuth, async (req, res) => {
  const currReview = await Review.findByPk(req.params.reviewId);

  if(!currReview) {
    res.status(404);
    return res.json({'message': "Review couldn't be found"})
  }

  if(req.user.id !== currReview.userId) {
    res.status(403);
    return res.json({"message": "Not Review Owner"})
  }

  const { stars, review } = req.body;

  if(typeof stars != 'number' ||stars < 1 || stars > 5 || review === ''){
    res.status(400);
    return res.json({
      "message": "Bad Request",
      "errors": {
        "review": "Review text is required",
        "stars": "Stars must be an integer from 1 to 5",
      }
    })
  }

  await currReview.update({ review, stars })

  res.status(200);
  return res.json(currReview);
})

//delete a review
router.delete('/:reviewId', requireAuth, async (req, res) => {
  const review = await Review.findByPk(parseInt(req.params.reviewId));

  if(!review) {
    res.status(404);
    return res.json({"message": "Review couldn't be found"});
  }

  if(parseInt(req.user.id) !== review.userId){
    res.status(403);
    return res.json({"message": "Not Review Owner"})
  }

  await review.destroy();

  res.status(200);
  return res.json({"message": "Successfully deleted"})
})

//Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res) => {
  const currReview = await Review.findByPk(req.params.reviewId);

  if(!currReview) {
    res.status(404);
    return res.json({"message": "Review couldn't be found"})
  }

  //not the user
  if(req.user.id !== currReview.userId) {
    res.status(403);
    return res.json({"message": "Not Review Owner"})
  };

  //maximum count
  const imageCount = await ReviewImage.count({
    where: {
      reviewId: parseInt(req.params.reviewId)
    }
  })

  if(imageCount > 9) {
    res.status(403);
    return res.json({"message": "Maximum number of images for this resource was reached"})
  };

  const { url } = req.body;

  const reviewImage = await ReviewImage.create({ url, reviewId: req.params.reviewId });

  //output
  const print = {
    id: reviewImage.id,
    url: reviewImage.url
  }

  return res.json(print);
})

module.exports = router;
