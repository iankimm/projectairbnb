const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { ReviewImage } = require('../../db/models');
const review = require('../../db/models/review');

const router = express.Router();

//delete a spot
router.delete('/:imageId', async (req, res) => {
  const reviewImage = await ReviewImage.findByPk(req.params.imageId);

  if(!reviewImage) {
    res.status(404);
    return res.json({"message": "Review Image couldn't be found"})
  }

  await reviewImage.destroy();

  return res.json({"message": "Successfully deleted"});
})

module.exports = router;
