const express = require('express');
const { Op, Sequelize } = require('sequelize');

const { requireAuth } = require('../../utils/auth');

const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');

const router = express.Router();

//Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res) => {
  const bookings = await Booking.findAll({
    include: [
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
      }
    ],
    where: { userId: req.user.id }
  })

  const print = bookings.map((booking) => {
    const temp = booking.toJSON();
    const final = {}

    if(temp.Spot.SpotImages.length > 0) {
      temp.Spot.reviewImage = temp.Spot.SpotImages[0].url
    }
    else {
      temp.Spot.reviewImage = ''
    }

    //placing in order
    final.id = temp.id;
    final.spotId = temp.spotId;
    final.Spot = temp.Spot;
    final.userId = temp.userId;
    final.startDate = temp.startDate;
    final.endDate = temp.endDate;
    final.createdAt = temp.createdAt;
    final.updatedAt = temp.updatedAt;

    delete final.Spot.SpotImages;
    return final;
  });

  return res.json({Bookings: print});
})

//Edit a Booking
router.put('/:bookingId', requireAuth, async (req, res) => {
  const booking = await Booking.findByPk(req.params.bookingId);

  if(!booking){
    res.status(404);
    return res.json({"message": "Booking couldn't be found"});
  }

  if(req.user.id !== booking.userId) {
    res.status(403);
    return res.json({'message': "Not Booking Owner"});
  }

  const { startDate, endDate } = req.body;

  if(new Date(endDate) < new Date()){
    res.status(403);
    return res.json({'message': "Past bookings can't be modified"})
  }

  const bookingId = parseInt(req.params.bookingId);

  const conflict = await Booking.findOne({
    where: {
      spotId: booking.spotId,
      id: {
        [Op.ne]: bookingId
      },
      [Op.or]: [
        { startDate: { [Op.between]: [startDate, endDate] } },
        { endDate: { [Op.between]: [startDate, endDate] } },
      ]
    },
  })

  if(conflict) {
    res.status(403);
    return res.json({
      "message": "Sorry, this spot is already booked for the specified dates",
      "errors": {
        "startDate": "Start date conflicts with an existing booking",
        "endDate": "End date conflicts with an existing booking"
      }
    })
  }

  await booking.update({ startDate, endDate });

  return res.json(booking);
})

//delete a booking
router.delete('/:bookingId', requireAuth, async (req, res) => {
  const bookingId = parseInt(req.params.bookingId);
  const booking = await Booking.findByPk(
    bookingId,
    {
      include:
      {
        model: Spot,
        attributes: ["ownerId"]
      }
    }
  );

  if(!booking) {
    res.status(404);
    return res.json({"message": "Booking couldn't be found"});
  }

  if(new Date(booking.startDate) < new Date()) {
    res.status(403);
    return res.json({"message": "Bookings that have been started can't be deleted"})
  }

  if(parseInt(req.user.id) === booking.userId || parseInt(req.user.id) === booking.Spot.ownerId) {
    await booking.destroy();

    res.status(200);
    return res.json({"message": "Successfully deleted"});
  }

  res.status(403);
  return res.json({"message": "Not Booking owner or Not Spot Owner"});
})

module.exports = router;
