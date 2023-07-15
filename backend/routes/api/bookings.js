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

//Edit a Booking
router.put('/:bookingId', async (req, res) => {
  const booking = await Booking.findByPk(parseInt(req.params.bookingId));

  const { startDate, endDate } = req.body;

  if(!booking) {
    res.status(404);
    return res.json({'message': "Booking couldn't be found"})
  }

  booking.startDate = startDate;
  booking.endDate = endDate;

  booking.save();

  return res.json(booking);
})

//delete a review
router.delete('/:bookingId', async (req, res) => {
  const booking = await Review.findByPk(req.params.bookingId);
  if(!booking) {
    res.status(404);
    return res.json({"message": "Booking couldn't be found"})
  }

  await booking.destroy();

  return res.json({"message": "Successfully deleted"});
})

module.exports = router;
