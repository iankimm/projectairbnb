// backend/routes/api/users.js
const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Spot, Review, SpotImage, Booking } = require('../../db/models');
const review = require('../../db/models/review');

const router = express.Router();

//create a new spot
router.post('', async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price} = req.body;

  const { user } = req;

  let ownerId = user.id;

  const spot = await Spot.create({address, ownerId, city, state, country, lat, lng, name, description, price});

  const safeSpot = {
    id: spot.id,
    ownerId: spot.ownerId,
    address: spot.address,
    city: spot.city,
    state: spot.state,
    country: spot.country,
    lat: spot.lat,
    lng: spot.lng,
    name: spot.name,
    description: spot.description,
    price: spot.price,
    createdAt: spot.createdAt,
    updatedAt: spot.updatedAt
  };

  await setTokenCookie(res, safeSpot);

  return res.json({
    spot: safeSpot
  });
})

//get all spots
router.get('/', async (req, res) => {
  let Spots = await Spot.findAll();
  return res.json({Spots})
})

//get all spots by Id
router.get('/current', async (req, res) => {
  const { user } = req;
  let Spots = await Spot.findAll({where: {ownerId: user.id}})
  return res.json({Spots})
})

//get details of a spot from an id
router.get('/:spotId', async (req, res) => {
  let Spots = await Spot.findByPk(parseInt(req.params.spotId));
  return res.json({Spots});
})

//edit a spot
router.put('/:spotId', async (req, res) => {
  const { user } = req;
  const spot = await Spot.findByPk(parseInt(req.params.spotId));

  const { address, city, state, country, lat, lng, name, description, price} = req.body;

  if(!spot) {
    res.status(404);
    return res.json({'message': 'spot not found'});
  }

  spot.address = address;
  spot.city = city;
  spot.state = state;
  spot.country = country;
  spot.lat = lat;
  spot.lng = lng;
  spot.name = name;
  spot.description = description;
  spot.price = price;

  await spot.save();
  return res.json(spot);
})

//delete a spot
router.delete('/:spotId', async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if(!spot) {
    res.status(404);
    return res.json({"message": "Spot couldn't be found"})
  }

  await spot.destroy();

  return res.json({"message": "Successfully deleted"});
})

//create a review for a spot based on the spot's id
router.post('/:spotId/reviews', async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);

  const { review, stars } = req.body;

  const { user } = req;

  let userId = user.id;
  let spotId = parseInt(req.params.spotId);

  const newReview = await Review.create({review, userId, spotId, stars});

  const safeReview = {
    id: newReview.id,
    userId: newReview.userId,
    spotId: newReview.spotId,
    stars: newReview.stars,
    review: newReview.review,
    createdAt: newReview.createdAt,
    updatedAt: newReview.updatedAt
  }

  await setTokenCookie(res, safeReview);

  return res.json({
    newReview : safeReview
  });
})

//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res) => {
  let id = parseInt(req.params.spotId);

  let Reviews = await Review.findAll({
    where: {spotId : id }
  });
  return res.json({Reviews})
})

//Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);

  const { url, preview } = req.body;

  let spotId = parseInt(req.params.spotId);

  const spotImage = await SpotImage.create({ url, preview, spotId});

  const safeImage = {
    id: spotImage.id,
    preview: spotImage.preview,
    spotId: spotImage.spotId,
    createdAt: spotImage.createdAt,
    updatedAt: spotImage.updatedAt
  }

  await setTokenCookie(res, safeImage);

  return res.json({
    spotImage : safeImage
  });
})


//BOOOOOOOOOOOOOOOKKKKKKKKKKKKKKKINNNNNNNNNNNNNNG
//create a booking
router.post('/:spotId/bookings', async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);

  const { startDate, endDate } = req.body;

  const { user } = req;

  let userId = user.id;
  let spotId = parseInt(req.params.spotId);

  const booking = await Booking.create({startDate, endDate, userId, spotId});

  const safeBooking = {
    id: booking.id,
    userId: booking.userId,
    spotId: booking.spotId,
    startDate: booking.startDate,
    endDate: booking.endDate,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt

  }

  await setTokenCookie(res, safeBooking);

  return res.json({
    booking : safeBooking
  });
})

//Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', async (req, res) => {
  let Bookings = await Booking.findAll({where: {spotId: parseInt(req.params.spotId)}});
  return res.json({Bookings})
})

//get all spots by Id
router.get('/current', async (req, res) => {
  const { user } = req;
  let Spots = await Spot.findAll({where: {ownerId: user.id}})
  return res.json({Spots})
})

//Add Query Filters to Get All Spots


module.exports = router;
