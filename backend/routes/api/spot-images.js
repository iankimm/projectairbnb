const express = require('express');

const { requireAuth } = require('../../utils/auth');

const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');

const router = express.Router();

//delete a spot
router.delete('/:imageId', requireAuth, async (req, res) => {
  const spotImage = await SpotImage.findByPk(req.params.imageId);

  if(!spotImage) {
    res.status(404);
    return res.json({"message": "Spot Image couldn't be found"});
  }

  const spot = await Spot.findByPk(spotImage.spotId);

  if(req.user.id !== spot.ownerId) {
    res.status(403);
    return res.json({"message": "Not Spot Owner"});
  }

  await spotImage.destroy();

  res.status(200);
  return res.json({"message": "Successfully deleted"});

})

module.exports = router;
