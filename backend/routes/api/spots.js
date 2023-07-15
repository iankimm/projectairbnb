// backend/routes/api/users.js
const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Spot } = require('../../db/models');

const router = express.Router();

//create a new spot
router.post('', async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price} = req.body;

  const { user } = req;

  let ownerId = user.id;

  const spot = await Spot.create({address, ownerId,city, state, country, lat, lng, name, description, price});

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
    price: spot.price
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


module.exports = router;
