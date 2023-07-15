const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { User, Spot, Review, SpotImage, Booking } = require('../../db/models');
const review = require('../../db/models/review');

const router = express.Router();

//Get all of the Current User's Bookings
router.get('/current', async (req, res) => {
  const { user } = req;
  let Bookings = await Booking.findAll({where: {userId: user.id}})
  return res.json({Bookings})
})

module.exports = router;
