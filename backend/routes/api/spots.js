// backend/routes/api/users.js
const express = require('express');

const { requireAuth } = require('../../utils/auth');

const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require('../../db/models');

const { Op, Sequelize } = require('sequelize');

const router = express.Router();

//create a new spot
router.post('/', requireAuth, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price} = req.body;

  const ownerId = req.user.id;

  const spot = await Spot.create({address, ownerId, city, state, country, lat, lng, name, description, price});

  res.status(201);
  return res.json({spot});
})

//get all spots + query
router.get('/', async (req, res) => {

  let {page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query;
  let tracker = false;

  if(page || size) tracker = true;
  page = page || 1;
  size = size || 20;

  if(page < 1 || page > 10 || size < 1 || size > 20 || (minPrice && minPrice < 0) || (maxPrice && maxPrice < 0) || (minLat && (minLat < -90 || minLat > 90)) || (maxLat && (maxLat < -90 || maxLat > 90)) || (minLng && (minLng < -180 || minLng > 180)) || (maxLng && (maxLng < -180 || maxLng > 180))) {
    res.status(400);
    res.json({
      "message": "Bad Request",
      "errors": {
        "page": "Page must be greater than or equal to 1",
        "size": "Size must be greater than or equal to 1",
        "maxLat": "Maximum latitude is invalid",
        "minLat": "Minimum latitude is invalid",
        "minLng": "Maximum longitude is invalid",
        "maxLng": "Minimum longitude is invalid",
        "minPrice": "Minimum price must be greater than or equal to 0",
        "maxPrice": "Maximum price must be greater than or equal to 0"
      }
    })
  }

  const queryFilter = {};
  if(minLat) {
    if(maxLat) {
      queryFilter.lat = {
        [Op.gt]: minLat,
        [Op.lt]: maxLat
      }
    }
    else {
      queryFilter.lat = {
        [Op.gt]: minLat
      }
    }
  }
  if(minLng) {
    if(maxLng) {
      queryFilter.lng = {
        [Op.gt]: minLng,
        [Op.lt]: maxLng
      }
    }
    else {
      queryFilter.lng = {
        [Op.gt]: minLng
      }
    }
  }
  if(minPrice) {
    if(maxPrice) {
      queryFilter.price = {
        [Op.gt]: minPrice,
        [Op.lt]: maxPrice
      }
    }
    else {
      queryFilter.price = {
        [Op.gt]: minPrice
      }
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
    where: queryFilter,
  });

  const print = spots.map((spot) => {
    const temp = spot.toJSON();
    const print = {};
    let avgStars = 0;

    for(let i = 0; i < spot.Reviews.length; i++){
      avgStars += spot.Reviews[i].dataValues.stars
    }
    avgStars = avgStars / spot.Reviews.length;

    if(spot.SpotImages.length > 0) {
      temp.previewImage = spot.SpotImages[0].url
    }
    else {
      temp.previewImage = ''
    }

    print.id = temp.id;
    print.ownerId = temp.ownerId;
    print.address = temp.address;
    print.city = temp.city;
    print.state = temp.state;
    print.country = temp.country;
    print.lat = temp.lat;
    print.lng = temp.lng;
    print.name = temp.name;
    print.description = temp.description;
    print.price = temp.price;
    print.createdAt = temp.createdAt;
    print.updatedAt = temp.updatedAt;
    print.avgRating = avgStars;
    print.previewImage = temp.previewImage;
    if(tracker) {
      print.page = page;
      print.size = size;
    }

    return print;
  })

  return res.json({ Spots: print})
})

//get all spots by Id
router.get('/current', requireAuth, async (req, res) => {
  let spots = await Spot.findAll({
    where: {
      ownerId: req.user.id
    },
    include : [
      {
        model: Review
      },
      {
        model: SpotImage
      }
    ],
  })

  const print = spots.map((spot) => {
    const temp = spot.toJSON();
    const print = {};
    let avgStars = 0;

    for(let i = 0; i < spot.Reviews.length; i++){
      avgStars += spot.Reviews[i].dataValues.stars
    }
    avgStars = avgStars / spot.Reviews.length;

    if(spot.SpotImages.length > 0) {
      temp.previewImage = spot.SpotImages[0].url
    }
    else {
      temp.previewImage = ''
    }

    print.id = temp.id;
    print.ownerId = temp.ownerId;
    print.address = temp.address;
    print.city = temp.city;
    print.state = temp.state;
    print.country = temp.country;
    print.lat = temp.lat;
    print.lng = temp.lng;
    print.name = temp.name;
    print.description = temp.description;
    print.price = temp.price;
    print.createdAt = temp.createdAt;
    print.updatedAt = temp.updatedAt;
    print.avgRating = avgStars;
    print.previewImage = temp.previewImage;

    return print;
  })

  return res.json({ Spots: print})
})

//get details of a spot from an id
router.get('/:spotId', async (req, res) => {
  let spots = await Spot.findByPk(req.params.spotId);

  if(!spots) {
    res.status(404);
    return res.json({"message": "Spot couldn't be found"})
  }

  const spotDetail = await Spot.findOne({
    where: {
      id: req.params.spotId,
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

  const reviews = await Review.findAll({
    where: {
      spotId: req.params.spotId
    }
  })

  let avgStars = 0;

  for(let i = 0; i < reviews.length; i++){
    avgStars += reviews[i].stars
  }
  avgStars = avgStars / reviews.length;

  const temp = spotDetail.toJSON();

  const print = {
    id: temp.id,
    ownerId: temp.ownerId,
    address: temp.address,
    city: temp.city,
    state: temp.state,
    country: temp.country,
    lat: temp.lat,
    lng: temp.lng,
    name: temp.name,
    description: temp.description,
    price: temp.price,
    createdAt: temp.createdAt,
    updatedAt: temp.updatedAt,
    numReviews: reviews.length,
    avgStarRating: avgStars,
    SpotImages: temp.SpotImages,
    Owner: temp.Owner
  }

  return res.json(print);
})

//edit a spot
router.put('/:spotId', requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if(!spot) {
    res.status(404);
    return res.json({'message': 'spot not found'});
  }

  if(req.user.id !== spot.ownerId) {
    res.status(403);
    return res.json({"message": "Not Spot Owner"})
  }

  const { address, city, state, country, lat, lng, name, description, price} = req.body;

  const ownerId = req.user.id;

  await spot.update({ownerId, address, city, state, country, lat, lng, name, description, price})

  return res.json(spot);
})

//delete a spot
router.delete('/:spotId', requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if(!spot) {
    res.status(404);
    return res.json({"message": "Spot couldn't be found"})
  }

  if(req.user.id !== spot.ownerId) {
    res.status(403);
    return res.json({"message": "Not Spot Owner"});
  }

  await spot.destroy();

  return res.json({"message": "Successfully deleted"});
})

//create a review for a spot based on the spot's id
router.post('/:spotId/reviews', requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if(!spot) {
    res.status(404);
    return res.json({"message": "Spot couldn't be found"})
  }

  const { review, stars } = req.body;

  const { user } = req;
  let userId = user.id;

  const check = await Review.findOne({
    where: {userId, spotId: parseInt(req.params.spotId)}
  })
  if(check) {
    res.status(403);
    return res.json("User already has a review for this spot");
  }

  const newReview = await Review.create({review, userId, spotId: req.params.spotId, stars});

  res.status(201);
  return res.json({ newReview });
})

//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if(!spot) {
    res.status(404);
    return res.json({"message": "Spot couldn't be found"})
  }

  const reviews = await Review.findAll({
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"]
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"]
      }
    ],
    where: { spotId: req.params.spotId }
  })

  return res.json({Reviews: reviews})
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
    return res.json({"message": "Not Spot Owner"})
  }

  const { url, preview } = req.body;

  const spotImage = await SpotImage.create({ url, preview, spotId: req.params.spotId});

  const print = {
    id: spotImage.id,
    url: spotImage.url,
    preview: spotImage.preview
  }

  return res.json({print});
})


//BOOOOOOOOOOOOOOOKKKKKKKKKKKKKKKINNNNNNNNNNNNNNG
//create a booking
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);

  if(!spot) {
    res.status(404);
    return res.json({"message": "Spot couldn't be found"});
  }

  const { user } = req;
  let userId = user.id;

  if(userId === spot.ownerId) {
    res.status(403);
    return res.json({"message": "Spot Owner"})
  }

  const { startDate, endDate } = req.body;

  let spotId = parseInt(req.params.spotId);

  const check = await Booking.findOne({
    where: {
      spotId,
      [Op.or]: [
        {
          startDate: {
            [Op.between]: [startDate, endDate],
          }
        },
        {
          endDate: {
            [Op.between]: [startDate, endDate],
          }
        }
      ]
    }
  })
  if(check) {
    res.status(403);
    return res.json({
      "message": "Sorry, this spot is already booked for the specified dates",
      "errors": {
        "startDate": "Start date conflicts with an existing booking",
        "endDate": "End date conflicts with an existing booking"
      }
    })
  }

  const booking = await Booking.create({startDate, endDate, userId, spotId});

  return res.json(booking);
})

//Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
  const spot = await Spot.findOne({ where: {id: req.params.spotId}})

  if(!spot) {
    res.status(404);
    return res.json({"message": "Spot couldn't be found"})
  }

  let bookings = await Booking.findAll({
    include: {
      model: User,
      attributes: ["id", "firstName", "lastName"]
    },
    where: {spotId: req.params.spotId}
  });

  let print = bookings.map((booking) => {
    let temp = {}
    if(req.user.id !== spot.ownerId) {
      temp.spotId = booking.spotId
      temp.startDate = booking.startDate
      temp.endDate = booking.endDate
    }
    else {
      temp.User = booking.User
      temp.id = booking.id
      temp.spotId = booking.spotId
      temp.userId = booking.userId
      temp.startDate = booking.startDate
      temp.endDate = booking.endDate
      temp.createdAt = booking.createdAt
      temp.updatedAt = booking.updatedAt
    }
    return temp;
  })
  return res.json({ Bookings: print })
})

module.exports = router;
