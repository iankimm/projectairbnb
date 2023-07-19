const express = require('express');
const { Op, Sequelize } = require('sequelize');

const { requireAuth } = require('../../utils/auth');

const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');

const router = express.Router();

//Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res) => {
  let bookings = await Booking.findAll({
    include: [
      {
        model: Spot,
        attributes: {
          exclude: ['createdAt', 'updatedAt']
        },
        include: {
          model: SpotImage,
          attributes: ['url'],
          limit: 1
        },
      },
    ],
    where: { userId: req.user.id }
  })

  const print = bookings.map((booking) => {
    const temp = booking.toJSON();
    if(temp.Spot.SpotImages.length > 0) {
      temp.Spot.previewImage = temp.Spot.SpotImages[0].url;
    }
    temp.Spot.lat = Number(temp.Spot.lat);
    temp.Spot.lng = Number(temp.Spot.lng);
    temp.Spot.price = Number(temp.Spot.price);

    delete temp.Spot.SpotImages;
    return temp;
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

  const conflict = await Booking.findOne({
    where: {
      spotId: booking.spotId
    },
    id: {
      [Op.ne]: bookingId
    },
    [Op.or]: [
      { startDate: { [Op.between]: [startDate, endDate] } },
      { endDate: { [Op.between]: [startDate, endDate] } },
    ]
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

  const print = {
    id: booking.id,
    spotId: booking.spotId,
    userId: booking.userId,
    startDate: booking.startDate,
    endDate: booking.endDate,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  };

  return res.json(print);
})

//delete a booking
router.delete('/:bookingId', requireAuth, async (req, res) => {
  const booking = await Review.findByPk(
    req.params.bookingId,
    include:
      {
        model: Spot,
        attributes: ["ownerId"]
      }
  );

  if(!booking) {
    res.status(404);
    return res.json({"message": "Booking couldn't be found"})
  }

  if(req.user.id !== booking.userId) {
    res.status(403);
    return res.json({"message": "Not Booking Owner"});
  }

  if(new Date(booking.startDate) < new Date()){
    res.status(403);
    return res.json({"message": "Bookings that have been started can't be deleted"})
  }

  await booking.destroy();

  res.status(200);
  return res.json({"message": "Successfully deleted"});
})

module.exports = router;
