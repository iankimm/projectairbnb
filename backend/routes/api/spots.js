// backend/routes/api/users.js
const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Spot } = require('../../db/models');

const router = express.Router();


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

module.exports = router;
