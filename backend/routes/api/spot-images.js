const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Spot, Review, SpotImage } = require('../../db/models');
const review = require('../../db/models/review');

const router = express.Router();

//delete a spot
router.delete('/:imageId', requireAuth, async (req, res) => {
  const spotImage = await SpotImage.findByPk(req.params.imageId);

  if(!spotImage) {
    res.status(404);
    return res.json({"message": "Spot Image couldn't be found"})
  }

  if(req.spot.ownerId === req.user.id){
    await spotImage.destroy();

    res.status(200);
    return res.json({"message": "Successfully deleted"});
  }
})

module.exports = router;
