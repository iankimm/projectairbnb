// backend/routes/api/users.js
const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');

const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');

const { Op, Sequelize } = require('sequelize');

const router = express.Router();

//valid check
const validateQuery = ( page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice) => {
  if(page > 10 || page < 1) {
    res.status(400);
    return res.json({
      'message': "Bad Request",
      'errors': {
        'page': "Page must be greater than or equal to 1 or less than or equal to 10",
      }
    })
  }
  if(size > 20 || size < 1) {
    res.status(400);
    return res.json({
      'message': "Bad Request",
      'errors': {
        'size': "Size must be greater than or equal to 1 or less than or equal to 20",
      }
    })
  }
  if(maxLat && (maxLat < -90 || maxLat > 90)) {
    res.status(400);
    return res.json({
      'message': "Bad Request",
      'errors': {
        'maxLat': "Maximum latitude must be between -90 and 90"
      },
    })
  }
  if(minLat && (minLat < -90 || minLat > 90)) {
    res.status(400);
    return res.json({
      'message': "Bad Request",
      'errors': {
        'minLat': "Minimum latitude must be between -90 and 90"
      },
    })
  }
  if(maxLng && (maxLng < -180 || maxLng > 180)) {
    res.status(400);
    return res.json({
      'message': "Bad Request",
      'errors': {
        'maxLng': "Maximum longitude must be between -180 and 180"
      },
    })
  }
  if(minLng && (minLng < -180 || minLng > 180)) {
    res.status(400);
    return res.json({
      'message': "Bad Request",
      'errors': {
        'minLng': "Minimum longitude must be between -180 and 180"
      },
    })
  }
  if(maxPrice && maxPrice < 0) {
    res.status(400);
    return res.json({
      'message': "Bad Request",
      'errors': {
        'maxPrice': "Maximum price must be greater than or equal to 0"
      },
    })
  }
  if(minPrice && minPrice < 0) {
    res.status(400);
    return res.json({
      'message': "Bad Request",
      'errors': {
        'minPrice': "Minimum price must be greater than or equal to 0"
      },
    })
  }
  return;
}

//create a new spot
router.post('/', requireAuth, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price} = req.body;

  let ownerId = req.user.id;

  const spot = await Spot.create({address, ownerId, city, state, country, lat, lng, name, description, price});

  res.status(201);
  return res.json({
    spot
  });
})

//get all spots + query
router.get('/', async (req, res) => {

  let {page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query;

  if(!page) {
    page = 1;
  }
  if(!size) {
    size = 20;
  }

  page = parseInt(page);
  size = parseInt(size);

  validateQuery(page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice);

  const where = {};
  if(minLat) {
    where.lat = {
      [Op.gte]: minLat
    }
  }
  if(maxLat) {
    where.lat = {
      ...where.lat, [Op.lte]: maxLat
    }
  }
  if(minLng) {
    where.lng = {
      [Op.gte]: minLng
    }
  }
  if(maxLng) {
    where.lng = {
      ...where.lng, [Op.lte]: maxLng
    }
  }
  if(minPrice) {
    where.price = {
      [Op.gte]: minPrice
    }
  }
  if(maxPrice) {
    where.price = {
      ...where.price, [Op.lte]: maxPrice
    }
  }

  let spots = await Spot.findAll({
    include: [
      {
        model: Review,
      },
      {
        model: SpotImage,
        attributes: ['url'],
        where: { preview: true },
        required: false,
      }
    ],
    limit: size,
    offset: (page - 1) * size,
    where,
  });

  const print = spots.map((spot) => {
    const reviews = spot.Reviews;
    const totalStars = reviews.reduce((acc, review) => acc + review.stars, 0);
    const avgRating = totalStars / reviews.length;
    return {
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
      updatedAt: spot.updatedAt,
      avgRating: avgRating,
      previewImage: spot.previewImage
    }
  })

  return res.json({ Spots: print})
})

//get all spots by Id
router.get('/current', requireAuth, async (req, res) => {
  const { user } = req;
  let spots = await Spot.findAll({
    where: {
      ownerId: user.id
    },
    include : [
      {
        model: SpotImage
      },
      {
        model: Review
      }
    ],
  })

  const print = spots.map((spot) => {
    const reviews = spot.Reviews;
    const totalStars = reviews.reduce((acc, review) => acc + review.stars, 0);
    const avgRating = totalStars / reviews.length;
    return {
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
      updatedAt: spot.updatedAt,
      avgRating: avgRating,
      previewImage: spot.previewImage
    }
  })

  return res.json({ Spots: print})
})

//get details of a spot from an id
router.get('/:spotId', async (req, res) => {
  const { spotId } = req.params;
  let spots = await Spot.findByPk(spotId);

  if(!spots) {
    res.status(404);
    return res.json({"message": "Spot couldn't be found"})
  }

  const spotDetail = await Spot.findOne({
    where: {
      id: spotId,
    },
    include: [
      {
        model: SpotImage,
        as: "SpotImages",
        attributes: ["id", "url", "preview"]
      },
      {
        model: User,
        as: "Owner",
        attributes: ["id", "firstName", "lastName"]
      }
    ]
  });

  const reviewDetail = await Review.findOne({
    where: {
      spotId
    },
    attributes: [
      [Sequelize.fn("COUNT", Sequelize.col("id")), "numReviews"],
      [Sequelize.fn("AVG", Sequelize.col("stars")), "avgStarRating"],
    ],
    raw: true
  })

  const { SpotImages, Owner, lat, lng, price, ...rest} = spotDetail.toJSON();

  const print = {
    ...rest,
    lat: Number(lat),
    lng: Number(lng),
    price: Number(price),
    numReviews: Number(reviewData.numReviews),
    avgStarRating: Number(reviewData.avgStarRating),
    SpotImages,
    Owner,
  }

  return res.json(print);
})

//edit a spot
router.put('/:spotId', requireAuth, async (req, res) => {
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
router.post('/:spotId/images', requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if(!spot) {
    res.status(404);
    return res.json({"message": "Spot couldn't be found"})
  }
  if(req.user.id !== spot.ownerId) {
    res.status(403);
    return res.json({"message": "Not authorized!"})
  }

  const { url, preview } = req.body;

  let spotId = parseInt(req.params.spotId);

  const spotImage = await SpotImage.create({ url, preview, spotId});

  const print = {
    id: spotImage.id,
    url: spotImage.url,
    preview: spotImage.preview
  }

  return res.json({print});
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



module.exports = router;
