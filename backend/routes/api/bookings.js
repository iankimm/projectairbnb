const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { User, Spot, Review, SpotImage, Booking } = require('../../db/models');
const review = require('../../db/models/review');

const router = express.Router();

const validateBooking = [

]

//Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res) => {
  const { user } = req;
  let Bookings = await Booking.findAll({
    // where: {userId: user.id}
    include: [
      {
        model: Spot,
        attributes: {exclude: ['createdAt', 'updatedAt']},
        include: {
          model: SpotImage,
          attributes: ['url'],
          where: { preview: true },
          required: false,
        },
      },
    ],
    where: { userId: req.user.id}
  })

  let print = [];
  for(let i = 0; i < Bookings.length; i++) {
    let temp = {};
    temp.id = Bookings[i].dataValues.id;
    temp.spotId = Bookings[i].dataValues.spotId;
    temp.Spot = Bookings[i].dataValues.Spot.dataValues;
    let image = 'null';
    if(Bookings[i].dataValues.Spot.dataValues.SpotImages[0].dataValues.url){
      image = Bookings[i].dataValues.Spot.dataValues.SpotImages[0].dataValues.url;
    }
    temp.Spot.previewImage = image;
    temp.userId = Bookings[i].dataValues.userId;
    temp.startDate = Bookings[i].dataValues.startDate;
    temp.endDate = Bookings[i].dataValues.endDate;
    temp.createdAt = Bookings[i].dataValues.createdAt;
    temp.updatedAt = Bookings[i].dataValues.updatedAt;

    delete temp.Spot.SpotImages;

    print.push(temp);
  }

  return res.json({Bookings : print});
})

//Edit a Booking
router.put('/:bookingId', requireAuth, async (req, res) => {
  const booking = await Booking.findByPk(parseInt(req.params.bookingId));

  if(!booking){
    res.status(404);
    return res.json({"message": "Booking couldn't be found"});
  }

  if(req.user.id !== booking.userId) {
    res.status(403);
    return res.json({'message': "this isn't your booking"});
  }

  if(new Date(booking.endDate) > new Date()){
    res.status(403);
    return res.json({'message': "Past bookings can't be modified"})
  }

  const { startDate, endDate } = req.body;

  booking.startDate = startDate;
  booking.endDate = endDate;

  booking.save();

  return res.json(booking);
})

//delete a review
router.delete('/:bookingId', requireAuth, async (req, res) => {
  const booking = await Review.findByPk(req.params.bookingId);
  if(!booking) {
    res.status(404);
    return res.json({"message": "Booking couldn't be found"})
  }
  if(new Date(booking.StartDate) < new Date()){
    res.status(403);
    return res.json({"message": "Bookings that have been started can't be deleted"})
  }

  await booking.destroy();

  res.status(200);
  return res.json({"message": "Successfully deleted"});
})

module.exports = router;
